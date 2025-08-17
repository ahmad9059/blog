export default async function handler(req, res) {
  const password = req.query.p || req.headers["x-personal-pass"];

  if (password !== process.env.PERSONAL_PASSWORD) {
    res.status(401).send("Unauthorized: Invalid password");
    return;
  }
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
