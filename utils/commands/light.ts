import { Command } from "commander";
import { usePdf } from "./use-pdf";
import { blueprint } from "./blueprint";
import { logger } from "./logger";

const program = new Command();

program.name("light").description("Next Light CLI").version("1.0.0");

program.command("use-pdf").description("Copy pdf.worker.min.mjs ke folder public/").action(usePdf );
program.command("blueprint")
    .option("-o, --only <names...>", "Run only specific blueprints")
    .description("Generate blueprint")
    .action(async (opts) => {
        await blueprint({ only: opts.only })

        logger.info("Success run all blueprints!")
        process.exit(0);
    });

program.parse();
