// @Filename: /a.ts
////export function [|{| "isWriteAccess": true, "isDefinition": true |}foo|](): void {}

// @Filename: /b.ts
////export { [|foo|] as [|{| "isWriteAccess": true, "isDefinition": true |}bar|] } from "./a";

// @Filename: /c.ts
////export { [|foo|] as [|{| "isWriteAccess": true, "isDefinition": true |}default|] } from "./a";

// @Filename: /d.ts
////export { [|{| "isWriteAccess": true, "isDefinition": true |}default|] } from "./c";

// @Filename: /e.ts
////import { [|{| "isWriteAccess": true, "isDefinition": true |}bar|] } from "./b";
////import [|{| "isWriteAccess": true, "isDefinition": true |}baz|] from "./c";
////import { [|default|] as [|{| "isWriteAccess": true, "isDefinition": true |}bang|] } from "./c";
////import [|{| "isWriteAccess": true, "isDefinition": true |}boom|] from "./d";
////[|bar|](); [|baz|](); [|bang|](); [|boom|]();

verify.noErrors();
const [foo0, foo1, bar0, foo2, defaultC, defaultD, bar1, baz0, defaultE, bang0, boom0, bar2, baz1, bang1, boom1] = test.ranges();
const a = { definition: "function foo(): void", ranges: [foo0] };
const b = { definition: "import bar", ranges: [bar0] };
const cd = { definition: "import default", ranges: [defaultC, defaultD] };
const eBar = { definition: "import bar", ranges: [bar1, bar2] };
const eBaz = { definition: "import baz", ranges: [baz0, baz1] };
const eBang = { definition: "import bang", ranges: [bang0, bang1] };
const eBoom = { definition: "import boom", ranges: [boom0, boom1] };

verify.referenceGroups([foo0, foo1, foo2], [a, b, eBar, cd, eBoom, eBaz, eBang]);

verify.referenceGroups(bar0, [b, eBar]);
verify.referenceGroups(bar1, [eBar, b]);
verify.referenceGroups(bar2, [{ ...eBar, definition: "(alias) bar(): void\nimport bar" }, b]);

verify.referenceGroups([defaultC, defaultD, defaultE], [cd, eBoom, eBaz, eBang]);
verify.referenceGroups(baz0, [eBaz]);
verify.referenceGroups(baz1, [{ ...eBaz, definition: "(alias) baz(): void\nimport baz" }]);

verify.referenceGroups(bang0, [eBang]);
verify.referenceGroups(bang1, [{ ...eBang, definition: "(alias) bang(): void\nimport bang" }]);

verify.referenceGroups(boom0, [eBoom]);
verify.referenceGroups(boom1, [{ ...eBoom, definition: "(alias) boom(): void\nimport boom" }]);

//needs rename tests!
