/// <reference path='fourslash.ts' />

// @Filename: B.ts
////export default class /*1*/[|{| "isWriteAccess": true, "isDefinition": true |}C|] {
////    test() {
////    }
////}

// @Filename: A.ts
////import [|{| "isWriteAccess": true, "isDefinition": true |}B|] from "./B";
////let b = new [|B|]();
////b.test();

goTo.marker("1");
verify.occurrencesAtPositionCount(1);

const ranges = test.ranges();
const [C, B0, B1] = ranges;
const classes = { definition: "class C", ranges: [C] };
const imports = { definition: "import B", ranges: [B0, B1] };
verify.referenceGroups(C, [classes, imports]);
verify.referenceGroups(B0, [imports, classes]);
verify.referenceGroups(B1, [
    { definition: "(alias) new B(): B\nimport B", ranges: [B0, B1] },
    classes
]);

goTo.rangeStart(C);
verify.renameLocations(false, false, [C, B0, B1]);

const rangesInB = [B0, B1];
for (const r of rangesInB) {
    goTo.rangeStart(r);
    verify.renameLocations(false, false, rangesInB);
}
