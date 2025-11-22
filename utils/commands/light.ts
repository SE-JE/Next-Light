#!/usr/bin/env tsx
import { Command } from "commander";
import { usePdf } from "./use-pdf";
import { blueprint } from "./blueprint";

const program = new Command();

program.name("light").description("Next Light CLI").version("1.0.0");

program.command("use-pdf").description("Copy pdf.worker.min.mjs ke folder public/").action(usePdf );
program.command("blueprint").description("Generate blueprint").action(blueprint);

program.parse();
