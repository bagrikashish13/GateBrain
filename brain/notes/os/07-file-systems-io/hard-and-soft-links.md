# Hard and soft links

## TL;DR
Hard links share the same inode and increment `i_nlink`; they cannot span filesystems or link directories. Soft links are independent files with their own inode holding a path string; deleting the target creates a dangling link.

## Core idea
- **Directory entry:** A directory is simply a table mapping filenames to inode numbers: `(filename, inode_number)`.
- **Hard link (`ln target hard_link`):**
  - Points to the **exact same inode** as the target.
  - Increments the inode's reference count (`i_nlink`) by 1.
  - No new inode is allocated; both filenames are equal co-owners of the data blocks.
- **Soft / Symbolic link (`ln -s target soft_link`):**
  - Creates a **brand-new file with its own distinct inode** (`i_nlink = 1`).
  - Its data block stores the textual pathname string of the target file.
  - Does NOT alter the target file's inode or `i_nlink`.
- **Cross-filesystem boundaries:**
  - Inode numbers are unique only within a single disk partition/filesystem.
  - **Hard links cannot cross filesystems** (triggers `EXDEV` error).
  - **Soft links can cross filesystems** because pathname resolution traverses mount points.
- **Directory linking:**
  - Hard links to directories are **strictly forbidden** to prevent cyclic graphs (infinite loops in directory traversal and `fsck`).
  - Soft links to directories are permitted.

## Where I got confused → what made it click
- **Locker room model:** Inode is Locker #42 with dial `i_nlink`. A hard link is another name tag on Locker #42 (dial $+1$, same locker). A soft link is a brand-new Locker #99 holding a sticky note with the target path.
- **Deleting files (`rm`):** `rm` calls `unlink()`, which only removes the directory entry and decrements `i_nlink`. Data is only wiped when `i_nlink == 0`. Hence, hard links keep working after the original name is deleted; soft links become dangling (broken shortcuts) because the target path no longer resolves.

## GATE traps
- **Target `i_nlink` during soft linking:** Creating 100 soft links to a file leaves the original file's `i_nlink` unchanged at 1.
- **Dangling links:** When the original file is deleted, soft links still exist on disk (their own inode is untouched), but attempting to open them throws `ENOENT` (file not found).
- **Directory cycles:** GATE MSQs often state "users can hard-link directories to create shortcuts" — always **FALSE**.

## Example
File `report.txt` (Inode #50, `i_nlink = 1`):
1. `ln report.txt hard_rep.txt` $\implies$ Inode #50 `i_nlink` becomes **2**.
2. `ln -s report.txt soft_rep.txt` $\implies$ Inode #50 `i_nlink` remains **2**; new Inode #99 is created for `soft_rep.txt` with `i_nlink = 1`.
3. `rm report.txt` $\implies$ Inode #50 `i_nlink` decrements to **1**. `cat hard_rep.txt` works; `cat soft_rep.txt` fails as a dangling link.
