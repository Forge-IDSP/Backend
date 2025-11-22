CREATE TABLE "my_pathway_badges" (
	"pathway_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	CONSTRAINT "my_pathway_badges_pathway_id_badge_id_pk" PRIMARY KEY("pathway_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE "my_pathways" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"template_id" text,
	"title" varchar(255) NOT NULL,
	"ai_summary" text,
	"ai_short_label" varchar(150),
	"steps" jsonb NOT NULL,
	"ai_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- CREATE TABLE "pathways" (
-- 	"id" text NOT NULL,
-- 	"template_slug" text NOT NULL,
-- 	"steps" jsonb NOT NULL,
-- 	"updated_at" timestamp with time zone NOT NULL,
-- 	CONSTRAINT "pathways_id_pk" PRIMARY KEY("id")
-- );
--> statement-breakpoint
ALTER TABLE "my_pathway_badges" ADD CONSTRAINT "my_pathway_badges_pathway_id_my_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."my_pathways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "my_pathway_badges" ADD CONSTRAINT "my_pathway_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "my_pathways" ADD CONSTRAINT "my_pathways_template_id_pathways_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."pathways"("id") ON DELETE no action ON UPDATE no action;