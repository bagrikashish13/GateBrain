# Part 8 · Computer Networks

Official GATE 2027 wording (Section 10): "Principles of Layering; Basics of switching (circuit, packet and virtual circuit) and performance metrics; Data link layer: error detection, Medium Access Control, Ethernet; Distance vector and link state routing; IPv4 - Fragmentation, CIDR Notation, Network Address Translation; TCP- flow control and congestion control, socket API; DNS and HTTP." Compared with 2026 it drops UDP, ARP, DHCP, ICMP, SMTP, FTP, email, framing and bridging: their PYQs are legacy here.

Main block, after COA. Weight from the papers: 7.4 marks a paper since 2014, 8.3 since 2021. The biggest blocks: IPv4 addressing and forwarding (CIDR, subnets, longest prefix match: about 1.6 a paper), TCP with congestion control (about 1.5), IP datagrams and fragmentation, routing, sliding windows, then medium access and error detection. Layering and delays come first because everything after is costed in them.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. Dijkstra and Bellman-Ford come from Algorithms (A10); here they become routing.

## CN01 · Layers, switching and delay
notes: computer-networks/01-layers-and-delay
hours: 2

### Layers
- CN01.1 T The TCP/IP stack: application, transport, network, link, physical (OSI adds session and presentation). Teaches: layering, ethernet
- CN01.2 T Each layer adds its header: message, segment, packet, frame, bits.
- CN01.3 T Hosts run every layer, routers up to the network layer, switches up to the link layer.
- CN01.4 T TCP and UDP are the transport protocols over IP; Ethernet is the usual link layer, carrying frames of at most 1500 data bytes.
- CN01.5 Q Which layer does what; what the transport layer adds over the network layer; how many times a packet passes each layer through routers. PYQ: 2025s1-6, 2013-14, 2012-10, 2004-15, 2003-28

### Delay and throughput
- CN01.6 T Transmission delay = packet bits / bandwidth; propagation delay = distance / signal speed. Teaches: link-delay
- CN01.7 T A request-reply costs a round trip (RTT = 2 × propagation, plus transmissions).
- CN01.8 T Bandwidth × delay = the bits in flight on a link.
- CN01.9 T Circuit switching reserves a path and bandwidth for the whole call; packet switching shares links packet by packet (headers, queueing); a virtual circuit sets a path up first and packets follow it in order. Teaches: switching
- CN01.10 T Store-and-forward: each hop receives the whole packet before sending it on, so one packet over k links takes k transmissions plus the propagations; with many packets the links work in parallel (pipelining).
- CN01.11 Q Time to deliver a file or packets over links and routers, with store-and-forward; end-to-end throughput. PYQ: 2026s2-11, 2024s1-26, 2015s3-36, 2014s2-26, 2012-44
- CN01.12 Q Circuit vs packet vs virtual-circuit switching; statistical multiplexing. PYQ: IT2007-62, 2005-73, 2005-23, IT2004-22

## CN02 · IPv4 addressing and forwarding
notes: computer-networks/02-ip-addressing
hours: 3

### Addresses and subnets
- CN02.1 T An IPv4 address is 32 bits, written as four bytes. Teaches: ip-address
- CN02.2 T In CIDR a.b.c.d/n the first n bits are the network; the block has 2^(32−n) addresses: the first is the network address, the last the broadcast, the 2^(32−n) − 2 in between go to hosts.
- CN02.3 T A subnet mask has n leading 1s; address AND mask = network address.
- CN02.4 T Two hosts are on the same subnet when their ANDs match.
- CN02.5 T Subnetting borrows host bits; a block can only start at a multiple of its size, which is how blocks are allocated and aggregated.
- CN02.6 Q Network and broadcast addresses, host counts, same subnet or not; allocate blocks to an organisation; aggregate prefixes. PYQ: 2026s2-23, 2026s1-46, 2024s2-28, 2020-38, 2019-28, 2015s3-38, 2012-34, 2010-47, 2008-57, IT2008-85, IT2008-84, 2007-67, 2006-45, IT2006-70, 2005-27, IT2005-76, IT2004-26, 2003-82

### Forwarding
- CN02.7 T A router forwards by looking the destination up in its table and using the entry with the longest matching prefix; a default route (0.0.0.0/0) catches everything else. Teaches: forwarding
- CN02.8 Q Which interface or next hop a packet takes under longest prefix match. PYQ: 2025s1-30, 2024s1-48, 2023-55, 2022-45, 2015s2-41, 2014s3-26, IT2006-63, 2004-55
- CN02.9 L Classful addressing (class A, B, C) and old statements about IP. PYQ: 2012-23

## CN03 · IPv4 datagrams, fragmentation and NAT
notes: computer-networks/03-ip-datagram
hours: 2

### The header
- CN03.1 T The IPv4 header: version, header length (in 4-byte words, 20 bytes without options), total length, identification, flags and offset (used when a datagram is split, next), TTL, protocol, header checksum, source and destination addresses. Teaches: ip-header
- CN03.2 T Every router decrements the TTL (dropping the packet at 0) and so recomputes the checksum.

### Fragmentation
- CN03.3 T Fragmentation: a datagram bigger than the next link's MTU is split. Teaches: fragmentation
- CN03.4 T Every fragment but the last carries a multiple of 8 data bytes (at most MTU − header); the offset counts 8-byte units; MF = 1 on all but the last; only the destination reassembles.
- CN03.5 Q Which header fields a router changes; why the TTL exists; the protocol and options fields; what is not in the IP header. PYQ: 2024s2-22, 2020-15, 2017s2-20, 2015s1-22, 2014s3-25, 2010-15., 2006-5, IT2004-86, 2003-27
- CN03.6 Q Number of fragments, their sizes, offsets and flags; the original datagram from a fragment. PYQ: 2025s2-13, 2025s1-47, 2024s2-18, 2024s1-55, 2016s1-53, 2015s2-52, 2014s3-28, 2014s2-25, 2013-37, 2004-57, 2004-56

### NAT
- CN03.7 T NAT: a router rewrites the private source address (and port) of outgoing packets to its public address and keeps a table to map the replies back, so the IP checksum (and the TCP/UDP checksum) change too. Teaches: nat
- CN03.8 Q Which fields NAT modifies. PYQ: 2024s1-21

## CN04 · Reliable delivery: stop-and-wait and sliding windows
notes: computer-networks/04-flow-control
hours: 2.5

### Stop-and-wait
- CN04.1 T Stop-and-wait: send one frame, wait for its ACK, retransmit on timeout. Teaches: arq
- CN04.2 T With a = propagation / transmission time, efficiency = 1 / (1 + 2a) (ACK time ignored).
- CN04.3 Q Stop-and-wait efficiency, throughput, or the frame size for a target; with frames lost. PYQ: 2025s2-26, 2023-7, 2017s1-45, 2016s1-55, 2015s2-8, 2015s1-53, IT2006-68, IT2005-72, 1992-01.v

### Sliding windows
- CN04.4 T A sliding window lets W frames be outstanding: efficiency = min(1, W / (1 + 2a)); the link is kept full once W ≥ 1 + 2a.
- CN04.5 T Throughput = efficiency × bandwidth.
- CN04.6 Q Window size for full utilisation, throughput or utilisation of a sliding window. PYQ: 2026s2-55, 2026s1-35, 2022-49, 2021s1-49, 2017s2-35, 2016s2-55, 2015s3-28, 2009-58, 2009-57, IT2008-64, 2007-69, 2006-44, IT2004-83
- CN04.7 T Go-Back-N: one timer, a lost frame and everything after it are resent; with k-bit sequence numbers the window is at most 2^k − 1.
- CN04.8 T Selective Repeat buffers out-of-order frames and resends only the lost one; window at most 2^(k−1).
- CN04.9 Q Sequence-number bits for a window; frames sent or resent under Go-Back-N or Selective Repeat when some are lost. PYQ: 2014s1-28, 2006-46, IT2006-64, 2005-25, IT2004-81, 2003-84

## CN05 · TCP
notes: computer-networks/05-tcp
hours: 2.5

### Connections and sequence numbers
- CN05.1 T TCP is a reliable, full-duplex byte stream over IP. Teaches: tcp
- CN05.2 T Every byte has a sequence number and ACKs are cumulative (the next byte expected).
- CN05.3 T The three-way handshake (SYN, SYN-ACK, ACK) and the closing FINs each use up one sequence number; the initial sequence number is random.
- CN05.4 Q Handshake, sequence and acknowledgement numbers, connection states and closing; what TCP does and does not guarantee. PYQ: 2026s1-8, 2025s1-12, 2024s1-19, 2021s2-7, 2021s1-44, 2017s1-14, 2015s3-22, 2015s1-19, 2009-47, IT2008-69, IT2007-14, IT2007-13, IT2004-28, IT2004-23
- CN05.5 Q TCP segments over links with smaller MTUs: the fragments created. PYQ: 2021s1-45, 2018-54, IT2004-87

### Flow control and wrap-around
- CN05.6 T Flow control: the receiver advertises a window and the sender keeps at most that many unacknowledged bytes, so throughput ≤ window / RTT.
- CN05.7 Q Throughput limited by the window; the window or scale factor needed for a bandwidth. PYQ: 2015s2-34
- CN05.8 T Sequence numbers wrap around: with a 32-bit space at B bytes a second, wrap-around time = 2³² / B.
- CN05.9 T The wrap-around time must exceed the maximum segment lifetime, which fixes the sequence-number bits a fast protocol needs.
- CN05.10 Q Wrap-around time; sequence-number bits for a given bandwidth and segment lifetime; unique identifiers. PYQ: 2023-40, 2022-50, 2018-25, 2014s3-27

### Sockets
- CN05.11 T The socket API: a server calls socket, bind, listen, accept and then recv/send; a client calls socket and connect, and connect sends the SYN. listen turns a socket passive. Teaches: socket
- CN05.12 Q The order of socket calls; which call sends the SYN or makes a socket passive. PYQ: 2015s2-20, 2014s2-24, 2008-59, 2008-17

## CN06 · TCP congestion control
notes: computer-networks/05-tcp
hours: 1.5

### The congestion window
- CN06.1 T Slow start: the congestion window starts at 1 MSS and doubles every RTT up to the threshold; congestion avoidance then adds 1 MSS per RTT (additive increase). Teaches: congestion
- CN06.2 T A timeout sets threshold = window / 2 and the window back to 1 MSS; three duplicate ACKs halve the window (multiplicative decrease).
- CN06.3 T The sender sends min(congestion window, receiver window).
- CN06.4 Q Trace the congestion window RTT by RTT; the time to reach a window; the window after a timeout or duplicate ACKs. PYQ: 2026s2-48, 2026s1-34, 2024s2-44, 2020-55, 2018-14, 2014s1-27, 2012-45, 2008-56, IT2008-68, IT2005-73, IT2004-88
- CN06.5 L Token-bucket traffic shaping (not in the 2027 wording). PYQ: 2016s1-54, 2008-58

## CN07 · Routing
notes: computer-networks/06-routing
hours: 1.5

### Distance vector and link state
- CN07.1 T Distance vector: each router keeps its distance to every destination and swaps vectors with its neighbours (Bellman-Ford). Teaches: dv-routing
- CN07.2 T Good news spreads fast, bad news slowly: count to infinity, eased by split horizon.
- CN07.3 Q Routing tables after exchanges; what happens after a link fails (count to infinity). PYQ: 2022-47, 2021s2-45, 2011-53, 2011-52, 2010-55, 2010-54, IT2007-60, IT2005-85a, IT2005-85b
- CN07.4 T Link state: each router floods the costs of its own links, so every router has the whole map and runs Dijkstra.
- CN07.5 T RIP is distance vector, OSPF link state, BGP routes between autonomous systems (path vector).
- CN07.6 Q Distance vector vs link state; RIP, OSPF and BGP statements; routing over a given structure. PYQ: 2025s2-8, 2025s2-7, 2023-15, 2017s2-09, 2014s2-23, 2014s1-23, IT2008-67, IT2007-63

## CN08 · Data link: errors, medium access, Ethernet
notes: computer-networks/07-data-link
hours: 2.5

### Error detection
- CN08.1 T Parity catches an odd number of flipped bits; 2D parity locates one. Teaches: error-detection
- CN08.2 T CRC: append r zeros (r = degree of the generator), divide modulo 2, and the remainder is what is sent after the data.
- CN08.3 T A code with minimum Hamming distance d detects d − 1 errors and corrects ⌊(d − 1)/2⌋.
- CN08.4 Q CRC remainders and transmitted bits; which errors a generator always detects. PYQ: 2026s2-33, 2021s2-34, 2017s1-32, 2009-48, 2007-68, IT2005-78
- CN08.5 Q Hamming distance and Hamming codes, parity schemes, the chance an error goes undetected. PYQ: 2025s1-46, 2021s1-29, 2017s2-34, IT2008-66, IT2007-43, IT2005-74, 1995-1.12, 1994-9, 1992-01.ii

### Medium access
- CN08.6 T Random access: pure ALOHA throughput G·e^(−2G), at most 18.4%; slotted ALOHA G·e^(−G), at most 36.8%. Teaches: mac
- CN08.7 T With n stations each sending with probability p, exactly one succeeds with probability n·p·(1 − p)^(n−1).
- CN08.8 Q ALOHA and slotted-access throughput and probabilities; time-division access. PYQ: 2021s2-54, 2015s1-29, 2007-65, IT2007-64, IT2005-75, IT2004-85
- CN08.9 T CSMA/CD: listen before sending and stop on a collision.
- CN08.10 T A sender must still be transmitting when the collision comes back, so the minimum frame = 2 × propagation delay × bandwidth; backoff after a collision is random and exponential.
- CN08.11 Q Minimum frame size, cable length or bandwidth under CSMA/CD; backoff. PYQ: 2024s2-45, 2018-55, 2016s2-53, 2015s3-6, 2013-36, IT2008-65, 2005-74, IT2005-71, IT2005-27, 2004-54, 2003-83

### Ethernet
- CN08.12 T Ethernet in detail: 48-bit MAC addresses, frames between a minimum and maximum size.
- CN08.13 T A hub repeats bits (one collision domain); a switch forwards frames by MAC address (a collision domain per port); a router joins networks, and at each hop the MAC addresses change while the IP addresses stay.
- CN08.14 Q Ethernet facts; which addresses change hop by hop; switches, subnets and the largest network a MAC address is unique in; header field lengths. PYQ: 2024s2-13, 2022-12, 2019-49, 2018-13, 2016s2-24, 2014s3-23, IT2006-66, IT2006-19, IT2004-27
- CN08.15 L Framing, bridges and token ring (dropped from the 2027 syllabus). PYQ: 2014s3-24, 2006-83, 2006-82, 2005-26, IT2005-28, 2004-16, IT2004-80

## CN09 · DNS and HTTP
notes: computer-networks/08-application-layer
hours: 1

### Fetching a web page
- CN09.1 T DNS turns a name into an address by asking root, top-level and authoritative servers, iteratively or recursively, usually over UDP; answers are cached. Teaches: dns-http
- CN09.2 T HTTP runs over TCP: non-persistent HTTP opens a connection per object, persistent HTTP reuses one; count one RTT for the TCP handshake and one per request.
- CN09.3 Q RTTs to fetch a page and its objects; DNS resolution steps; what a freshly booted host sends first; HTTP statements. PYQ: 2026s1-9, 2024s1-6, 2023-42, 2022-25, 2020-25, 2016s2-25, 2008-14, IT2005-77
- CN09.4 L Protocols outside the 2027 syllabus: email (SMTP, POP3, IMAP), FTP, UDP, ARP, DHCP, ICMP, and traffic statistics. PYQ: 2026s2-12, 2025s2-6, 2021s1-8, 2019-29, 2019-16, 2017s2-18, 2016s1-25, 2016s1-24, 2015s1-17, 2013-12, 2012-22, 2011-4, IT2008-20, 2007-70, 2007-20, IT2007-69, IT2006-69, IT2006-67, IT2006-18, 2005-24, IT2005-29, IT2005-26, IT2005-25
