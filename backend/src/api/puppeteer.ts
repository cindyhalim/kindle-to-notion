import chromium from "chrome-aws-lambda";

const launchAndGoTo = async ({ link }: { link: string }) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  console.log("Visiting link", link);
  await page.goto(link);

  return { page, browser };
};

export const puppeteer = {
  launchAndGoTo,
};
