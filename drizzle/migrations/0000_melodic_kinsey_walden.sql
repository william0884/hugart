CREATE TABLE IF NOT EXISTS "char_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"sentence" text NOT NULL,
	"url" text NOT NULL,
	"imgdescribe" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "char_gen" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"char_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "char_gen" ADD CONSTRAINT "char_gen_char_id_char_table_id_fk" FOREIGN KEY ("char_id") REFERENCES "public"."char_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
