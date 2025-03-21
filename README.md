Here’s the English translation of your text:

---

# HackerNews

This is a refactor version of the HackerNews website built with a modern tech stack, offering real-time translated English tech news and discussions.

## Project Features

- 🚀 Real-time synchronization of the latest HackerNews content
- 🤖 Intelligent translation powered by the OpenAI API
- 💻 Modern user interface design
- ⚡ Fast loading speeds and responsive design
- 🌐 Support for browsing various content categories

## Tech Stack

### Frontend

- **Next.js 14**: A React framework for building modern server-rendered applications
- **Tailwind CSS**: A utility-first CSS framework for styling
- **shadcn/ui**: A high-quality UI component library
- **Lucide Icons**: A modern, minimalist icon library

### Backend

- **Next.js API Routes**: Server-side API implementation
- **Prisma**: A modern ORM tool
- **PostgreSQL**: Primary database
- **OpenAI API**: Provides high-quality content translation services

### Deployment and Infrastructure

- **Vercel**: Application hosting and automated deployment
- **Vercel Cron Jobs**: Scheduled task handling
- **Vercel Postgres**: Database service

## Development Environment Requirements

- Node.js 18+
- pnpm 8+
- PostgreSQL (optional for local development)

## Local Development

1. Clone the project

   ```bash
   git clone https://github.com/ViggoZ/hackernews-cn.git
   cd hackernews-cn
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Configure environment variables

   ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file and fill in the necessary environment variables:

   - `DATABASE_URL`: PostgreSQL database connection URL
   - `NEXT_PUBLIC_APP_URL`: Application URL
   - `CRON_SECRET`: Cron job secret key

4. Initialize the database

   ```bash
   pnpm prisma db push
   ```

5. Start the development server

   ```bash
   pnpm dev
   ```

   Visit http://localhost:3000 to view the application.

## Deployment

This project is pre-configured for direct deployment to the Vercel platform.

1. Fork this project to your GitHub account
2. Import the project in Vercel
3. Configure the necessary environment variables:
   - `DATABASE_URL`: Recommended to use Vercel Postgres; create it in the Vercel dashboard and obtain the connection URL
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
   - `CRON_SECRET`: Set a secure random string to protect the cron job API
4. Initialize the database:
   - After deployment, open the project in the Vercel dashboard
   - Go to the "Storage" tab and create a Postgres database
   - The database will initialize automatically
5. Once deployed, the app will be accessible

Note: The project is configured to automatically update content hourly. You can monitor cron job execution in Vercel’s "Cron Jobs" section.

## Project Structure

```
├── src/
│ ├── app/ # Next.js app routes and pages
│ ├── components/ # React components
│ ├── lib/ # Utility functions and configurations
│ └── types/ # TypeScript type definitions
├── prisma/ # Database models and migrations
├── public/ # Static assets
└── ...configuration files
```

## Features

- Real-time HackerNews content synchronization
  - Automatically fetches the latest content hourly
  - Supports multiple content types: Latest, Hot, Ask HN, Show HN, Jobs
- User experience
  - Modern and minimalist interface design
  - Responsive layout with seamless mobile support
  - Fast page loading and transitions
  - Dark mode support
- System features
  - Reliable deployment via Vercel
  - PostgreSQL data persistence
  - Automated scheduled updates
  - Incremental Static Regeneration (ISR)

## Contribution Guidelines

Pull Requests and Issues are welcome!

## Feedback

If you encounter any issues or have suggestions during use, please provide feedback via:

1. Submit an Issue on GitHub
2. Contact [@decohack](https://twitter.com/decohack) on Twitter
3. Send an email to [viggo.zw@gmail.com] (please replace with your email)

## License

MIT License

---

Let me know if you need further adjustments!
# hacker-news-neo
