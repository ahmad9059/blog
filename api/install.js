export default async function handler(req, res) {
  const url =
    "https://raw.githubusercontent.com/ahmad9059/Scripts/main/entry.sh";
  const response = await fetch(url);

  if (!response.ok) {
    res
      .status(response.status)
      .send(`Error fetching script: ${response.statusText}`);
    return;
  }
  const script = await response.text();
  res.setHeader("Content-Type", "text/plain");
  res.send(script);
}
