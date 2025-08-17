export default async function handler(req, res) {
  const url =
    "https://api.github.com/repos/ahmad9059/hyprPersonal/contents/personal.sh";

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3.raw",
    },
  });

  if (!response.ok) {
    res.status(response.status).send("Unable to fetch install script");
    return;
  }
  const script = await response.text();
  res.setHeader("Content-Type", "text/plain");
  res.send(script);
}
