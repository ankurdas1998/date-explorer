# APIs and their corresponding outputs:

---

## api: /facts

```
curl --request POST \
  --url http://localhost:3000/facts \
  --header 'content-type: application/json' \
  --data '{
  "date": "yyyy-mm-dd"
}'
```

##### output:

```
{
  "dateFacts": [Array of Objects],
  "yearFacts": [Array of Objects]
}
```

---

## api: /all-events

```
curl --request POST \
  --url http://localhost:3000/all-events \
  --header 'content-type: application/json' \
  --data '{
  "date": "2025-04-05"
}'
```

##### output:

```
{
  "Events": [
    {
      "title": "...",  // Event title (could be year or event name)
      "desc": "...",   // Description of the event
      "category": "events"  // The category of the event
    }
  ],
  "Births": [
    {
      "title": "...",  // Birth year or notable person
      "desc": "...",   // Description or additional details
      "category": "birthdays"
    }
  ],
  "Deaths": [
    {
      "title": "...",  // Death year or notable person
      "desc": "...",   // Description or additional details
      "category": "deaths"
    }
  ]
}

```

---
