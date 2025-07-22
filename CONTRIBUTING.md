# Contributing to ElegantCommerce

Thank you for your interest in contributing to ElegantCommerce! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ElegantCommerce.git
   cd ElegantCommerce
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/mericulasK/ElegantCommerce.git
   ```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- .NET 8.0 SDK
- PostgreSQL database
- Git

### Installation Steps
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the database**:
   ```bash
   npm run db:push
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: Node.js backend
   npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   
   # Terminal 3: .NET backend
   cd backend/EliteShopAPI && dotnet run
   ```

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**
- **Feature implementations**
- **Documentation improvements**
- **Performance optimizations**
- **Test coverage improvements**
- **UI/UX enhancements**

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** for new features or significant changes to discuss the approach
3. **Comment on an issue** to let others know you're working on it

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run tests
npm test

# Check TypeScript compilation
npm run check

# Test the application manually
npm run dev
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve issue description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Testing instructions** for reviewers

## 📝 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer functional programming patterns

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop types with TypeScript
- Implement proper error boundaries
- Follow accessibility best practices

### .NET/C#
- Follow Microsoft C# coding conventions
- Use proper async/await patterns
- Implement proper error handling
- Add XML documentation comments
- Follow SOLID principles

### Database
- Use proper migrations for schema changes
- Follow naming conventions for tables and columns
- Add proper indexes for performance
- Use transactions for data consistency

## 🧪 Testing Guidelines

### Frontend Testing
- Write unit tests for utility functions
- Add component tests for React components
- Include integration tests for user flows
- Maintain test coverage above 80%

### Backend Testing
- Write unit tests for services and utilities
- Add integration tests for API endpoints
- Test error handling scenarios
- Mock external dependencies

### Test Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="ComponentName"
```

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node.js version)
- **Error messages** or console logs

### Feature Requests
For feature requests, please include:
- **Clear description** of the proposed feature
- **Use case** and motivation
- **Possible implementation** approach
- **Alternative solutions** considered

## 📚 Documentation

- Update README.md for significant changes
- Add inline code comments for complex logic
- Update API documentation for backend changes
- Include examples in documentation
- Keep Progress.md updated with development status

## 🏷️ Labeling

We use the following labels for issues and PRs:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority items
- `priority: low` - Low priority items

## 🎯 Development Priorities

Current development priorities:
1. Payment gateway integration
2. Comprehensive testing suite
3. Performance optimization
4. Production deployment setup
5. Mobile responsiveness improvements

## 📞 Getting Help

If you need help:
- Check existing documentation
- Search through existing issues
- Create a new issue with the `help wanted` label
- Join our community discussions

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to ElegantCommerce! 🛍️
