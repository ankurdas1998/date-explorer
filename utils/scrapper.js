const cheerio = require("cheerio");

const scrapeWiki = async (req, res) => {
  const [month, day] = [4, 5];

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

    const eventsStr = $("[id=1901–present]").parent().next().text();
    const birthsStr = $("[id=1901–present_2]").parent().next().text();
    const deathsStr = $("[id=1901–present_3]").parent().next().text();

    function parseString(input) {
      const lines = input.split("\n");
      const result = [];

      lines.forEach((line) => {
        const index = line.indexOf("–") !== -1 ? line.indexOf("–") : line.indexOf("-");

        const split = index !== -1 ? [line.substring(0, index), line.substring(index + 1)] : [line];

        const title = split[0].trim();
        const desc =
          split[1]
            ?.replace(/\[\d{1,2}\]/g, "")
            .replace(/\\/g, "")
            .trim() || "";

        result.push({ title, desc });
      });

      return result;
    }

    const events = parseString(eventsStr),
      births = parseString(birthsStr),
      deaths = parseString(deathsStr);

    const data = {
      Events: events,
      Births: births,
      Deaths: deaths,
    };

    const categoryMapping = {
      Events: "events",
      Births: "birthdays",
      Deaths: "deaths",
    };

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const items = data[key];

        items.forEach((item) => {
          item.category = categoryMapping[key];
        });

        items.sort(function (a, b) {
          return parseInt(b.title) - parseInt(a.title);
        });
      }
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error scraping:", error.message);
    res.status(500).json({ error: "Failed to scrape Wikipedia" });
  }
};

module.exports = scrapeWiki;
