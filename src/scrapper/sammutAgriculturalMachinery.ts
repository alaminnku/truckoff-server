import puppeteer from "puppeteer";

export default async function scrapSammutAgriculturalMachinery() {
  try {
    // Create browser
    const browser = await puppeteer.launch();

    try {
      // Create page
      const page = await browser.newPage();

      // Truck URLs
      let truckUrls: string[] = [];

      // Get all truck urls from 9 pages
      for (let i = 1; i < 10; i++) {
        try {
          // Go to the page
          await page.goto(
            `https://sammutagriculturalmachinery.equipmentsales.com.au/search?page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "body > div.container > div > div.col-lg-8.col-md-8.col-sm-8 > div:nth-child(2) > div > div > div > a"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) =>
                  `https://sammutagriculturalmachinery.equipmentsales.com.au${urlNode.getAttribute(
                    "href"
                  )}`
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Name
              const name = document.querySelector(
                "body > div.container > div > div.col-lg-8 > div > div.row.heading > div.col-lg-10.col-xs-12 > h1"
              )?.textContent;

              // Price
              const price = document.querySelector(
                "body > div.container > div > div.col-lg-8 > div > div.row.heading > div.col-lg-10.col-xs-12 > div > div"
              );

              // Year
              const year = document.querySelector(
                "#features > div > dl > dd:nth-child(8)"
              )?.textContent;

              // Make
              const make = document.querySelector(
                "#features > div > dl > dd:nth-child(4)"
              )?.textContent;

              // Model
              const model = document.querySelector(
                "#features > div > dl > dd:nth-child(6)"
              )?.textContent;

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#carousel > div > ul > li > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("src")
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                model,
                images,
                location: "NSW",
              };
            });

            console.log(truck);
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
}
