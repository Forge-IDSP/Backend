CREATE TABLE "career_paths" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"level" varchar(100) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"min_income" integer NOT NULL,
	"income" integer NOT NULL,
	"year" varchar(50) NOT NULL,
	"training_required" varchar(500) NOT NULL,
	"training_year" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"text" varchar(1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"skill" varchar(255) NOT NULL,
	"priority" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "career_paths" ADD CONSTRAINT "career_paths_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_routines" ADD CONSTRAINT "daily_routines_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;