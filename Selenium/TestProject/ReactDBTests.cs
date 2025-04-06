using System;
using System.Text.RegularExpressions;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace TestProject
{
    public class ReactDBTests
    {
        private IWebDriver? driver;
        private ReactDBTestClass? cianTestClass;

        [SetUp]
        public void Setup()
        {
            Console.WriteLine("Setup: " + DateTime.Now.ToString());
            Environment.SetEnvironmentVariable("webdriver.gecko.driver", @"D:\ПиТПМ (Тестирование)\Лаб 5 Selenium\geckodriver-v0.35.0-win-aarch64\geckodriver.exe");
            driver = new FirefoxDriver();

            //Environment.SetEnvironmentVariable("webdriver.gecko.driver", @"D:\ПиТПМ (Тестирование)\Лаб 5 Selenium\edgedriver_win64\msedgedriver.exe");
            //driver = new EdgeDriver();

            driver.Navigate().GoToUrl("http://localhost:3000/");
            driver.Manage().Window.Maximize();
            cianTestClass = new ReactDBTestClass(driver);
        }

        //[Test]
        //public void LoginTest()
        //{
        //    Console.WriteLine(DateTime.Now.ToString());
        //    cianTestClass.Login();
        //    Console.WriteLine("Login test passed.");
        //}

        //[Test]
        //public void VerifyUserTest()
        //{
        //    Console.WriteLine(DateTime.Now.ToString());
        //    cianTestClass.Login();
        //    cianTestClass.VerifyUser();
        //    Console.WriteLine("Verify email test passed.");
        //}

        [Test]
        public void CreateArticleTest()
        {
            Console.WriteLine(DateTime.Now.ToString());

            ClassicAssert.IsTrue(cianTestClass.CheckTitle(TestData.ExpectedTitleValue), "Title check failed.");
            Console.WriteLine("Title check passed.");

            ClassicAssert.IsTrue(cianTestClass.ElementToCreateNewIsVisible(), "Element to create new is not visible.");
            Console.WriteLine("Element to create new is visible.");

            ClassicAssert.IsTrue(cianTestClass.Login(TestData.LoginEmail, TestData.password), "Login failed.");
            Console.WriteLine("Login is success.");

            ClassicAssert.IsTrue(cianTestClass.CheckVisibilityElementAfterLogin(), "Element that is displayed after authorization is not displayed.");
            Console.WriteLine("Element that is displayed after authorization is displayed.");

            ClassicAssert.IsTrue(cianTestClass.VerifyUser(TestData.LoginEmail, TestData.ExpectedNameValue), "User verification failed.");
            Console.WriteLine("Verify user is success!");

            ClassicAssert.IsTrue(cianTestClass.CreateArticle(TestData.ArticleTitleInput, TestData.ArticleSummaryInput, TestData.ArticleTextInput), "Create article failed.");
            Console.WriteLine("Create article is success!");

            ClassicAssert.IsTrue(cianTestClass.DeleteArticle(TestData.ArticleTitleInput), "Delete article failed.");
            Console.WriteLine("Delete article is success!");
        }


        [TearDown]
        public void TearDown()
        {
            driver?.Quit();
            driver?.Dispose();
        }
    }
}
