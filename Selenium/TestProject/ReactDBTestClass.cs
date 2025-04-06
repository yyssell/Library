using System;
using System.Text.RegularExpressions;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace TestProject
{
    public class ReactDBTestClass
    {
        private IWebDriver driver;
        private Random random = new();

        public By HeaderElement => By.Name("header");

        // Авторизация
        public By SingInButton => By.XPath("//a[text()='Войти']");
        public By AuthInputButton => By.XPath("//input[@name='email']");
        public By PasswordInput => By.XPath("//input[@name='password']");
        public By ButtonLogIn => By.XPath("//button[@type='submit']");

        // Проверка пользователя
        public By ProfileName => By.XPath("//span[text()='Пользователь: Admin']");
        public By ToUserProfile => By.XPath("//a[text()='Профиль']");
        public By EmailElement => By.Name("user-email");
        public By NameElement => By.Name("user-name");

        // На главную
        public By ButtonHeader => By.XPath("//button[text()='Блог, гайды... название!']");


        // Создание новой статьи
        public By ToCreateNew => By.XPath("//a[text()='Создать новую статью']");
        public By ArticleTitleInput => By.XPath("//input[@placeholder='Enter article title']");
        public By ArticleSummaryInput => By.XPath("//textarea[@placeholder='Enter article summary']");
        public By TagSelect => By.Name("tag-theme");

        public By TagOption1 => By.XPath($"//option[@value='{TestData.TagOption1}']");
        public By TagOption2 => By.XPath($"//option[@value='{TestData.TagOption2}']");

        public By ButtonCodeBlock => By.XPath("//button[@class='ql-code-block']");

        public By ArticleTextInput => By.XPath("//div[@class='ql-editor']");

        public By ButtonSaveArticle => By.XPath("//button[@name='save-btn']");

        //на главную
        public By ArticlesSearchInput => By.Name("main-search");
        public By ToArticleBTN => By.Name("to-article");
        public By DeleteArticleBTN => By.Name("delete-article");


        public By UserProfileName => By.Name("user-profile-name");

        


        public ReactDBTestClass(IWebDriver driver)
        {
            this.driver = driver;
        }

        public bool CheckTitle(string expectedTitle)
        {
            var actualValue = this.driver.Title;
            return actualValue == expectedTitle;
        }

        public bool Login(string login, string password)
        {
            ClickElement(SingInButton);
            SendKeysCharacterByCharacter(AuthInputButton, login);
            SendKeysCharacterByCharacter(PasswordInput, password);
            ClickElement(ButtonLogIn);

            try
            {
                WaitForElement(UserProfileName, TimeSpan.FromSeconds(5));
                this.driver.FindElement(UserProfileName);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool CheckVisibilityElementAfterLogin()
        {
            try
            {
                WaitForElement(UserProfileName);
                this.driver.FindElement(UserProfileName);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool VerifyUser(string expectedEmail, string expectedName)
        {
            ClickElement(ToUserProfile);

            try
            {
                var emailElement = WaitForElement(EmailElement);
                var actualEmail = emailElement.Text;
                if (actualEmail != expectedEmail)
                {
                    return false;
                }

                var nameElement = WaitForElement(NameElement);
                var actualName = nameElement.Text;
                if (actualName != expectedName)
                {
                    return false;
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool ElementToCreateNewIsVisible()
        {
            ClickElement(ButtonHeader);
            try
            {
                IWebElement element = driver.FindElement(ToCreateNew);
                return element.Displayed;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public bool CreateArticle(string articleTitle, string articleSummary, string articleText)
        {
            ClickElement(ButtonHeader);

            ClickElement(ToCreateNew);

            SendKeysCharacterByCharacter(ArticleTitleInput, articleTitle);

            ClickElement(ArticleSummaryInput);
            SendKeysCharacterByCharacter(ArticleSummaryInput, articleSummary);

            ClickElement(TagSelect);
            ClickElement(TagOption1);
            //ClickElement(TagSelect);
            ClickElement(TagOption2);

            ClickElement(ButtonCodeBlock);
            SendKeysToElement(ArticleTextInput, articleText);

            ClickElement(ButtonSaveArticle);
            return true;
        }

        public bool DeleteArticle(string articleTitle)
        {
            ClickElement(ButtonHeader);

            SendKeysCharacterByCharacter(ArticlesSearchInput, articleTitle);

            ClickElement(ToArticleBTN);

            ClickElement(DeleteArticleBTN);

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            IAlert alert = wait.Until(drv => drv.SwitchTo().Alert());

            alert.Accept();

            ClickElement(ButtonHeader);
            SendKeysCharacterByCharacter(ArticlesSearchInput, articleTitle);

            try
            {
                this.driver.FindElement(ToArticleBTN);
                return false;
            }
            catch (Exception)
            {
                return true;
            }
        }


        public void ClickElement(By element)
        {
            var initElement = WaitForElement(element);
            Thread.Sleep(random.Next(500, 1000));
            initElement.Click();
        }

        public IWebElement? WaitForElement(By element, TimeSpan? timeout = null)
        {
            var wait = new WebDriverWait(driver, timeout ?? TimeSpan.FromSeconds(5));
            try
            {
                return wait.Until(drv =>
                {
                    var elem = drv.FindElement(element);
                    return elem.Displayed ? elem : null;
                });
            }
            catch (WebDriverTimeoutException ex)
            {
                throw new Exception($"Element {element} is not displayed!\n" + ex.Message);
            }
        }



        public void SendKeysToElement(By element, string keys)
        {
            var initElement = WaitForElement(element);
            initElement.SendKeys(keys);
        }

        public void ClearAndSendKeysToElement(By element, string keys)
        {
            var initElement = WaitForElement(element);
            //initElement.Clear();
            ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].value = '';", initElement); //Для Edge

            initElement.SendKeys(keys);
        }

        public void SendKeysCharacterByCharacter(By element, string keys)
        {
            var initElement = WaitForElement(element);
            foreach (char key in keys)
            {
                initElement.SendKeys(key.ToString());
                Thread.Sleep(10);
            }
        }

        public static string NormalizePhoneNumber(string phoneNumber)
        {
            string digitsOnly = Regex.Replace(phoneNumber, @"[^\d]", "");

            if (digitsOnly.Length == 11 && digitsOnly.StartsWith("7")) return digitsOnly;
            else if (digitsOnly.Length == 10) return "7" + digitsOnly;

            throw new ArgumentException("Invalid phone number format");
        }


        public void ScrollDown()
        {
            var jsExecutor = (IJavaScriptExecutor)driver;
            jsExecutor.ExecuteScript("window.scrollBy(0, 500);");
        }

        public bool WaitForElementExisting(By element)
        {
            bool isElementPresent = false;
            try
            {
                var initElement = WaitForElement(element);
                if (initElement != null)
                    isElementPresent = true;
            }
            catch { isElementPresent = false; };
            return isElementPresent;
        }

        public void WaitForCodeInput(By codeInputElement)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(60));
            wait.Until(d =>
            {
                var verificationCodeInput = d.FindElement(codeInputElement);
                return verificationCodeInput.GetDomAttribute("value").Length == 4;
            });
        }
    }
}
