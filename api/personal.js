export default async function handler(req, res) {
  const url =
    "https://api.github.com/repos/ahmad9059/hyprPersonal/contents/personal.sh?ref=main";

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`, // <-- store token in env
      Accept: "application/vnd.github.v3.raw",
    },
  });

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
