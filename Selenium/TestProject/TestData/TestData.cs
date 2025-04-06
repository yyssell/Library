global using global::NUnit.Framework;
global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Threading;
global using global::System.Threading.Tasks;


namespace TestProject
{
    public static class TestData
    {
        // Данные пользователя
        public const string LoginEmail = "cebotarenkodima@gmail.com";
        public const string password = "1234";

        // Значения ввода при создании статьи
        public const string TagOption1 = "DevOps";
        public const string TagOption2 = "Git";

        public const string ArticleTitleInput = "Новая тестовая статья для проверки";
        public const string ArticleSummaryInput = "Новая тестовая статья для проверки cоздания статьи в целом да и просто использование функций сайта";
        public const string ArticleTextInput = " public class CianTestClass\r\n    {\r\n        private IWebDriver driver;\r\n        private Random random = new();\r\n\r\n        public By HeaderElement => By.Name(\"header\");\r\n\r\n        // Авторизация\r\n        public By SingInButton => By.XPath(\"//a[text()='Войти']\");\r\n        public By AuthInputButton => By.XPath(\"//input[@name='email']\");\r\n        public By PasswordInput => By.XPath(\"//input[@name='password']\");\r\n        public By ButtonLogIn => By.XPath(\"//button[@type='submit']\");}\n}";


        // Данные об ожидаемых значениях
        public const string ExpectedTitleValue = "ReactDB";
        public const string ExpectedNameValue = "Admin";
        //public const string ExpectedEmailValue = "<strong>Почта:</strong> cebotarenkodima@gmail.com";
    }
}
