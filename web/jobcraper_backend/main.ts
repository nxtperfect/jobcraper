import { Hono } from "npm:hono"
import { Database } from "jsr:@db/sqlite";

const app = new Hono()

const db = new Database("../../db/database.db");

app.get('/offers', (c) => {
  try {
    const stmt = db.prepare("SELECT * FROM offers ORDER BY last_seen DESC;");
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

app.post('/update/offers/is_applied', async (c) => {
  const data = await c.req.json();
  try {
    const stmt = db.prepare("UPDATE offers SET is_applied=? WHERE id=?;");
    const hashId = data.id;
    const is_applied = data.isApplied;
    stmt.run(is_applied, hashId);

    return c.json(200);
  } catch (error) {
    console.error("Error updating offers:", error);
    return c.json({ error: `Failed to update offers ${error}` }, 500);
  }
});

app.get('/statistics', (c) => {
  try {
    const stmt = db.prepare(`SELECT
  technologies,
  COUNT(DISTINCT technologies) as count_technologies,
  is_applied,
  COUNT(is_applied) as count_is_applied,
  by_company,
  COUNT(DISTINCT by_company) as count_by_company
FROM offers;`);
    const statistics = stmt.all() as Array<{
      technologies: Array<string>,
      count_technologies: number,
      is_applied: Array<string>,
      count_is_applied: number,
      by_company: string,
      count_by_company: number
    }>;
    return c.json(statistics);
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return c.json({ error: "Failed to fetch statistics" }, 500);
  }
})

app.onError((err, c) => {
  return c.text("Unexpected error: ", err);
})

app.notFound((c) => {
  return c.text("Route not found");
})

await Deno.serve(app.fetch)
