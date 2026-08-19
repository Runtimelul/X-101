import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const makeCommits = async (n) => {
  console.log(`Generating ${n} commits...`);

  for (let i = 1; i <= n; i++) {
    // Generate dates strictly in the past (1 to 1,460 days ago / 4 years back)
    const daysAgo = random.int(1, 365 * 4);
    const hours = random.int(0, 23);
    const minutes = random.int(0, 59);

    const date = moment()
      .subtract(daysAgo, "days")
      .set({ hour: hours, minute: minutes })
      .toISOString();

    const data = { date: date };

    // Write file and create local commit
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(date, { "--date": date });

    if (i % 100 === 0 || i === n) {
      console.log(`[${i}/${n}] Commit created for date: ${date}`);
    }
  }

  console.log("Pushing all commits to origin/main...");
  try {
    await git.push("origin", "main", { "--force": true });
    console.log("Push successful! All commits are now on GitHub.");
  } catch (err) {
    console.error("Push error:", err);
  }
};

makeCommits(1425);
