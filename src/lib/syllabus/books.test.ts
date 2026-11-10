import { describe, expect, it } from "vitest";
import { mergeBooks, parseBook, pyqRef } from "./books";

describe("pyqRef", () => {
  it("turns GATE Overflow titles into the syllabus ids", () => {
    expect(pyqRef("GATE CSE 2016 | Set 1 | Question: 25")).toMatchObject({ id: "2016s1-25", paper: "CS", year: 2016, set: 1, q: "25", title: "GATE CSE 2016 Set 1 | Question: 25" });
    expect(pyqRef("GATE CSE 2008 | Question: 14, ISRO2016-74")?.id).toBe("2008-14");
    expect(pyqRef("GATE CSE 1987 | Question: 1-xix")?.id).toBe("1987-1.xix");
    expect(pyqRef("GATE CSE 1992 | Question: 01,ii")).toMatchObject({ id: "1992-01.ii", q: "01,ii", title: "GATE CSE 1992 | Question: 01,ii" });
    expect(pyqRef("GATE CSE 1992 | Question: 01-iv")?.id).toBe("1992-01.iv");
    expect(pyqRef("GATE IT 2004 | Question: 13")?.id).toBe("IT2004-13");
    expect(pyqRef("GATE DS&AI 2024 | Question: 4")?.id).toBe("DA2024-4");
    expect(pyqRef("GATE CSE 2017 Set 2 | Question: 55")?.id).toBe("2017s2-55");
    expect(pyqRef("ISRO 2016 | Question: 74")).toBeNull();
  });
  it("keeps General Aptitude questions apart from the technical ones with the same number", () => {
    expect(pyqRef("GATE CSE 2026 | Set 2 | GA | Question: 6")).toMatchObject({ id: "2026s2-ga6", set: 2, q: "ga6", title: "GATE CSE 2026 Set 2 | GA Question: 6" });
    expect(pyqRef("GATE CSE 2019 | GA | Question: 10")?.id).toBe("2019-ga10");
    expect(pyqRef("GATE DS&AI 2024 | GA | Question: 3")?.id).toBe("DA2024-ga3");
    // the same question as the 2022 and 2026 books title it
    expect(pyqRef("GATE CSE 2015 Set 2 | Question: GA-7")?.id).toBe("2015s2-ga7");
    expect(pyqRef("GATE CSE 2016 Set 1 | Question: GA04")?.id).toBe("2016s1-ga4");
    expect(pyqRef("GATE CSE 2017 Set 1 | GA Question: 3")?.id).toBe("2017s1-ga3");
    expect(pyqRef("GATE CSE 2016 | Set 2 | GA | Question: 04")?.id).toBe("2016s2-ga4");
    expect(pyqRef("GATE CSE 2010 | Question: 62")?.id).toBe("2010-62"); // before 2014 GA was Q56–65 of the paper
  });
});

const BOOK = `2.1                                               Application Layer Protocols (13)
 Practice Tests: Test 1 (15Q) Test 2 (4Q)

2.1.1 Application Layer Protocols: GATE CSE 2008 | Question: 14, ISRO2016-74
 What is the maximum size of data that the application layer can pass on to the TCP layer below?

A. Any size                                                                 B. bytes - size of TCP header

gatecse-2008 easy computer-networks  application-layer-protocols  isro2016

Answer key

2.1.2 Application Layer Protocols: GATE CSE 2011 | Question: 4
 Which is the application level protocol used in each activity?
© Copyright GATE Overflow. Some rights reserved.
   gatecse-2011 computer-networks application-layer-protocols easy

 Answer key
2.1.1 Application Layer Protocols: GATE CSE 2008 | Question: 14, ISRO2016-74 top                      https://gateoverflow.in/412
 OPTION A, it is the transport layer's job.
`;

describe("parseBook", () => {
  it("splits a book into questions with their topic and tags, ignoring repeats in answer sections", () => {
    const e = parseBook(BOOK);
    expect(e.map((x) => x.id)).toEqual(["2008-14", "2011-4"]);
    expect(e[0]).toMatchObject({ section: "2.1.1", topic: "Application Layer Protocols", tags: ["gatecse-2008", "easy", "computer-networks", "application-layer-protocols", "isro2016"] });
    expect(e[0].text).toMatch(/^What is the maximum size/);
    expect(e[1].text).toBe("Which is the application level protocol used in each activity?");
  });
  it("keeps the fuller text when books overlap", () => {
    const thin = parseBook(BOOK);
    const full = parseBook(BOOK.replace("bytes - size of TCP header", "216 bytes - size of TCP header"));
    expect(mergeBooks([thin, full]).get("2008-14")?.text).toMatch(/216 bytes/);
  });
});
