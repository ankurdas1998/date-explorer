const getFacts = async (req, res) => {
  const date = req.body.date;

  const [year, month, day] = date.split("-");
  const dt = { day, month, year };

  const boringYearFacts = new Set([
    `${year} is the year that nothing interesting came to pass.`,
    `${year} is the year that the Earth probably went around the Sun.`,
    `${year} is the year that nothing remarkable happened.`,
    `${year} is the year that we do not know what happened.`,
  ]);

  async function fetchFacts(dt, factType) {
    const facts = new Set();
    const maxAttempts = 20;
    let attempt = 0;

    const url =
      factType === "day"
        ? `http://numbersapi.com/${dt.month}/${dt.day}/date`
        : `http://numbersapi.com/${dt.year}/year`;

    while (facts.size < 10 && attempt <= maxAttempts) {
      const res = await fetch(url);
      const fact = await res.text();
      attempt++;

      if (factType === "year" && boringYearFacts.has(fact)) {
        return [{ fact, category: "fun-fact" }];
      }

      facts.add(fact);
    }

    const factArr = Array.from(facts).map((fact) => ({
      fact,
      category: "fun-fact",
    }));

    return factArr;
  }

  const [dateFacts, yearFacts] = await Promise.all([fetchFacts(dt, "day"), fetchFacts(dt, "year")]);

  res.status(200).send({ dateFacts, yearFacts });
};

module.exports = getFacts;
