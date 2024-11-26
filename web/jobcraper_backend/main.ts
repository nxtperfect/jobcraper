import { Hono } from "npm:hono"
import { Database } from "jsr:@db/sqlite";

const app = new Hono()

const db = new Database("../../db/database.db", { readonly: true });

app.get('/offers', (c) => {
  try {
    const stmt = db.prepare("SELECT * FROM offers ORDER BY last_seen;");
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

app.post('/update/offers/isApplied', (c) => {
  try {
    const stmt = db.prepare("UPDATE offers SET is_applied=? WHERE id=?;");
    c.req.param("offers").forEach((hashId: string, is_applied: string) => {
      stmt.run(is_applied, hashId);
    });
    
    return c.json(200);
  } catch (error) {
    console.error("Error updating offers:", error);
    return c.json({ error: "Failed to update offers" }, 500);
  }
});

app.onError((err, c) => {
  return c.text("Unexpected error: ", err);
})

app.notFound((c) => {
  return c.text("Route not found");
})

await Deno.serve(app.fetch)
