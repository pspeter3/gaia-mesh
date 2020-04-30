import { lerp } from "./utils";

describe("utils", () => {
    describe("lerp", () => {
        it("should linearly interpolate", () => {
            expect(lerp(0, 2, 0.5)).toStrictEqual(1);
        });
    });
});
