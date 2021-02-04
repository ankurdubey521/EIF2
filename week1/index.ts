import module2 from "./moduleSolutions/module2";
import module3 from "./moduleSolutions/module3";
import module4 from "./moduleSolutions/module4";

const main = async () => {
    await module2()
    await module3();
    await module4();
}

main();