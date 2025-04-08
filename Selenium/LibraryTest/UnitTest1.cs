using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Interactions;
using NUnit.Framework;
using System.Xml.Linq;


namespace LibraryTest
{
    public class Tests
    {
        [TestFixture]
        public class LibraryTests
        {
            private IWebDriver driver;
            private WebDriverWait wait;

            [SetUp]
            public void Setup()
            {
                Environment.SetEnvironmentVariable("webdriver.edge.driver",
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Drivers", "msedgedriver.exe"));
                driver = new EdgeDriver();
                wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                driver.Manage().Window.Maximize();
                driver.Navigate().GoToUrl("http://5.181.187.191:7000/");
            }

            [Test]
            public void AuthAndCreateBook()
            {
                try
                {
                    // Авторизация
                    wait.Until(d => d.FindElement(By.LinkText("Войти"))).Click();

                    var emailField = wait.Until(d =>
                    {
                        var el = d.FindElement(By.CssSelector("._authInput_foca7_22:nth-child(1)"));
                        return el.Displayed && el.Enabled ? el : null;
                    });
                    emailField.Clear();
                    emailField.SendKeys("sonia@gmail.com");

                    var passwordField = wait.Until(d =>
                    {
                        var el = d.FindElement(By.CssSelector("._authInput_foca7_22:nth-child(2)"));
                        return el.Displayed && el.Enabled ? el : null;
                    });
                    passwordField.Clear();
                    passwordField.SendKeys("123456");

                    wait.Until(d => d.FindElement(By.CssSelector("._authButton_foca7_37"))).Click();

                    // Переход к созданию книги
                    wait.Until(d => d.FindElement(By.LinkText("Администрирование"))).Click();
                    wait.Until(d => d.FindElement(By.LinkText("Создать новый элемент"))).Click();

                    // Заполнение формы
                    var nameField = wait.Until(d => d.FindElement(By.Name("name")));
                    nameField.SendKeys("Тестовое название");

                    var descriptionField = wait.Until(d => d.FindElement(By.Name("description")));
                    descriptionField.SendKeys("Тестовое описание");

                    var unitPriceField = wait.Until(d => d.FindElement(By.Name("unit_price")));
                    unitPriceField.SendKeys("1200");

                    var rentalPriceField = wait.Until(d => d.FindElement(By.Name("rental_price")));
                    rentalPriceField.SendKeys("100");

                    var categoryDropdown = wait.Until(d =>
                    {
                        var select = new SelectElement(d.FindElement(By.Name("category_id")));
                        return select.Options.Count > 0 ? select : null;
                    });
                    categoryDropdown.SelectByText("История");

                    var stockField = wait.Until(d => d.FindElement(By.Name("stock_quantity")));
                    stockField.Clear();
                    stockField.SendKeys("10");

                    var imagePathField = wait.Until(d => d.FindElement(By.Name("image_path")));
                    imagePathField.SendKeys("stock.jpg");

                    var submitButton = wait.Until(d =>
                    {
                        var btn = d.FindElement(By.CssSelector("button[type='submit']"));
                        return btn.Displayed && btn.Enabled ? btn : null;
                    });
                    new Actions(driver).MoveToElement(submitButton).Click().Perform();

                    // Проверка создания
                    var adminLink = wait.Until(d => d.FindElement(By.LinkText("Администрирование")));
                    new Actions(driver)
                        .MoveToElement(adminLink)
                        .Pause(TimeSpan.FromMilliseconds(500))
                        .Click()
                        .Perform();

                    var sortSelect = wait.Until(d =>
                    {
                        var select = new SelectElement(d.FindElement(By.CssSelector("._sortSelect_x2xm5_127")));
                        return select.Options.Count > 0 ? select : null;
                    });
                    sortSelect.SelectByText("ID");
                    wait.Until(d => d.FindElement(By.CssSelector("div#root div._sortPanel_x2xm5_90 span._sortDirection_x2xm5_145"))).Click();

                    var createdBook = wait.Until(d =>
                        d.FindElement(By.CssSelector("tr:first-child td:nth-child(3)")));

                    Assert.AreEqual("Тестовое название", createdBook.Text.Trim());
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Тест упал: {ex.Message}");
                    throw;
                }
            }

            [TearDown]
            public void Cleanup()
            {
                if (driver != null)
                {
                    driver.Quit();
                    driver = null;
                }
            }
        }
    }
}