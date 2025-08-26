# Polling App with QR Code

## Project Purpose

This project is a modern polling application that allows users to create, share, and vote on polls in real time. It features QR code integration for easy poll sharing and leverages AI tools to enhance development productivity and user experience.

---

## Features

- **Create Polls:** Users can create polls with custom questions and multiple options.
- **Vote in Real Time:** Poll results update live as users vote.
- **QR Code Sharing:** Instantly generate a QR code for each poll, making it easy to share and participate.
- **Authentication:** Secure login and logout using Supabase Auth.
- **Responsive UI:** Built with Tailwind CSS for a clean, mobile-friendly interface.
- **AI-Assisted Development:** Utilized AI tools for code generation, refactoring, and documentation.

---

## Technology Stack

- **Next.js:** React framework for server-side rendering and routing.
- **TypeScript:** Type-safe JavaScript for robust development.
- **Supabase:** Backend-as-a-Service for authentication, database, and real-time subscriptions.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **PostCSS & Autoprefixer:** For CSS processing.
- **pnpm:** Fast, disk space-efficient package manager.
- **AI Tools:** GitHub Copilot and GPT-4 for code suggestions, refactoring, and documentation.

---

## Running Locally


### 1. Run the Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## AI Tools Integration

### GitHub Copilot

- **Code Generation:** Used Copilot to scaffold React components, API routes, and utility functions.
- **Refactoring:** Leveraged Copilot for code suggestions and improvements, especially for state management and hooks.
- **Unit Tests:** Generated initial unit test templates for critical components.

### GPT-4 (ChatGPT)

- **Documentation:** Generated and refined this README, as well as inline code comments.
- **Debugging:** Provided solutions for common errors (e.g., module resolution, Tailwind setup).
- **Code Review:** Suggested best practices for file structure, error handling, and security.

#### Example: AI-Generated Voting Logic

```tsx
// VotingCard.tsx (excerpt)
const vote = async (optionIndex: number) => {
  setVoting(true)
  try {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId, optionIndex })
    })
    const data = await response.json()
    if (response.ok) {
      setHasVoted(true)
      fetchVotes()
    } else {
      alert(data.error || 'Failed to vote')
    }
  } catch (error) {
    alert('Failed to vote')
  } finally {
    setVoting(false)
  }
}
```
*This logic was scaffolded and improved using GitHub Copilot and GPT-4 suggestions.*

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
