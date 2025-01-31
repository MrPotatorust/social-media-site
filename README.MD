# Social media site

> [!CAUTION]
> **WORK IT PROGRESS**

This project is the biggest project as of writing this README.MD

## This project has 2 versions

#### [1. Frontend_old](#frontend_old)

- This is version was abandoned but you can stil find it in the repository.

#### [2. Frontend-react-router](#frontend-react-router)

- Current version that is being developed.

### Point of the project

Its a social media site that I am developing in my free time because I wanted to understand how social media sites work (I wont be implementing an advanced algorithm) with commenting, post interactions and similar features. I have learned a lot about relational databases in the making of this site and reusable design.

### Frontend_old

- Abandoned
- I abandoned this version of the frontend because I only made it in Vanilla JS because I wanted to see how the DOM is manipulated and how sites are developed without frameworks because React hides a lot of the "basics".
- In this version you can display posts, interact with them, reset passwords, verify emails, display profiles **although some of them might not work because the endpoints have changed**.

### Frontend-react-router

- Currently being developed
- I changed over to React because its a lot easier to add and reuse code you have already written, in this version of react there is also a lot more type safety.
- In this version you can do all of the features featured [here](#features)

### Features

1. Auth

- Login, Register
- Resetting password, Verifying email

2. Posts and interactions

- You can post "posts" and interact with them eg. like, **dislike**, reposts, save
- Commenting

3. Profiles

- You can look at your and other users profiles (half working)

4. Recommendations

- Recommended posts based on your hashtags (upcoming)
- Trending hashtags on the homepage

5. Direct messaging (should be added at a later date)

6. Moderation (should be added at a later date)

### Technologies used:

1. Django Rest Framework
2. React Router v7
3. Javascript, Typescript
4. Redis, SQlite
