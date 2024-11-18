import { Hono } from "npm:hono"
import { Database } from "jsr:@db/sqlite";

const app = new Hono()

const db = new Database("../../db/database.db", { readonly: true });

app.get('/offers', (c) => {
  try {
    const stmt = db.prepare("SELECT * FROM offers");
    const offers = stmt.all() as Array<{
      id: string,
      title: string,
      date_added: string,
      by_company: string,
      city: string,
      additional_info: string,
      technologies: string,
      link: string
    }>;
    
    return c.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return c.json({ error: "Failed to fetch offers" }, 500);
  }
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

await Deno.serve(app.fetch)
