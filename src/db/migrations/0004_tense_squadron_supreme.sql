CREATE TABLE "employers" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_name" varchar(50) NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(500) NOT NULL,
	"logo" varchar(255)
);
