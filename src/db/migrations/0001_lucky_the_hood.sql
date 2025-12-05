CREATE TABLE "income_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"level" varchar(100) NOT NULL,
	"years" varchar(50) NOT NULL,
	"amount" integer NOT NULL,
	"progress" integer NOT NULL,
	"trade" varchar(50) NOT NULL
);
