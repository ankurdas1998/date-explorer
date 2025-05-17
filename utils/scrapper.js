const cheerio = require("cheerio");

const scrapeWiki = async (req, res) => {
  const date = req.body.date;

  const [y, m, day] = date.split("-");
  const month = parseInt(m, 10);

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateStr = `${months[month]}_${day}`;
  const url = `https://en.wikipedia.org/wiki/${dateStr}`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const eventsStr = $("[id=1901–present]").parent().next();
    const birthsStr = $("[id=1901–present_2]").parent().next();
    const deathsStr = $("[id=1901–present_3]").parent().next();

    function parseHTML(input, category) {
      const $events = $("<ul>" + input + "</ul>");
      const result = [];

      $events.find("li").each(function () {
        const $li = $(this);

        $li.find("sup").remove();
        const fullText = $li.text();

        const yearMatch = fullText.match(/\b\d{4}\b/);
        const year = yearMatch ? yearMatch[0] : null;

        let title = "";
        if (category !== "events") {
          const links = $li.find("a");
          title = links.last().attr("title") || "";
        } else {
          title = $li.find("a").eq(1).attr("title") || "";
        }

        const desc = fullText
          .replace(/^\s*\d{4}\s*[-–]\s*/i, "") // removes leading year + dash
          .trim();

        result.push({ year, title, desc, category });
      });

      result.sort((a, b) => {
        // Convert year to number, fallback to 0 if invalid
        const yearA = parseInt(a.year, 10) || 0;
        const yearB = parseInt(b.year, 10) || 0;
        return yearB - yearA;
      });

      return result;
    }

    const events = parseHTML(eventsStr, "events"),
      births = parseHTML(birthsStr, "births"),
      deaths = parseHTML(deathsStr, "deaths");

    const data = {
      Events: events,
      Births: births,
      Deaths: deaths,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Error scraping:", error.message);
    res.status(500).json({ error: "Failed to scrape Wikipedia" });
  }
};

module.exports = scrapeWiki;
