1. git checkout -b 2-topics
   -> complete task 2
2. git add .
3. git commit -m ""
4. git push origin 2-topics
5. go to Github
6. click compare & pull request
7. merge base:main <- compare 2-topics
8. click Create pull request
9. give it a title and description
10. click create pull request
11. share link via /nchelp pr (e.g. github-username/nc-news-api/pull/1)
    -> Click Merge pull request + confirm merge on Github
12. go back to terminal on project
13. need to go onto main branch and pull down all the changes we have pushed to Github:
14. git checkout main
15. git pull origin main
16. git checkout -b 3-api (create new branch for next task)
17. git branch -D 2-topics (delete branch of previous task)
18. repeat for following tasks
