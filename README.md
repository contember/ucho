# Contember Echo

Welcome to your new project created with [Contember AI Studio](https://www.contember.com/studio)! If you need
assistance, feel free to join the conversation in
our [GitHub Discussions](https://github.com/orgs/contember/discussions/categories/support).

## Getting Started

Before you begin, ensure you have:

- [Yarn](https://yarnpkg.com/getting-started/install) installed
- [Docker](https://docs.docker.com/get-docker/) installed and running

### Project Overview

Your project consists of the following packages:

#### [@app/admin](./admin)

- **Location:** `./admin`
- **Description:** A React SPA that serves as the administration UI, built with Contember DataBinding for seamless
  integration with the Contember API.

#### [@app/api](./api)

- **Location:** `./api`
- **Description:** Defines the data model and permissions for the Contember API.

#### [@app/client](./client)

- **Location:** `./client`
- **Description:** A type-safe GraphQL client for interacting with the Contember API, complete with generated types.
- **Documentation:** [Client Documentation](./client/README.md)

#### [@app/worker](./worker)

- **Location:** `./worker`
- **Description:** A serverless function deployed to Cloudflare Workers for executing server-side operations.
- **Documentation:** [Worker Documentation](./worker/README.md)

- - -

## Running the Project Locally

Follow these steps to set up and run your project locally:

1. **Install Dependencies**

   Run the following command to install all required dependencies:
   ```bash
   yarn install
   ```

2. **Start the Project**

   Start the admin application and all necessary services with:
   ```bash
   yarn run start
   ```

   This will launch the following components:

| Container        | Port        | Url                                            |
|------------------|-------------|------------------------------------------------|
| Contember Engine | 1481        | [http://localhost:1481](http://localhost:1481) |
| Postgres         | 1482        | [http://localhost:1482](http://localhost:1482) |
| MailPit          | 1484        | [http://localhost:1484](http://localhost:1484) |
| Adminer          | 1485        | [http://localhost:1485](http://localhost:1485) |
| S3               | 1483 a 1486 | [http://localhost:1486](http://localhost:1486) |


When you're done, stop the Docker containers with:

```bash
docker compose down
```

- - -

## Next Steps

Congratulations, your project is now running locally! Access the administration UI
at [http://localhost:1480](http://localhost:1480/).

Enjoy building with Contember!

- - -

## Update headless UI components

To update the headless UI components, run the following command:

```bash
yarn run ui:update
```

This will update `lib` folder in the `@app/admin` package with the latest headless UI components. If you have made any
changes to the components, make sure to commit them before running this command.

# Specification 

### 1. Application Purpose

The **Feedback Tracker** is designed to streamline the process of collecting, managing, and analyzing feedback for software projects. It provides project teams with a centralized platform to view, prioritize, and resolve user feedback, ultimately improving product quality and user satisfaction. By organizing feedback by project—and now by **custom groupings**—the system offers enhanced clarity when dealing with large volumes of feedback.

### 2. Target Users

1. **Project Managers**: Oversee feedback management, create and maintain groupings, and prioritize issues.
2. **Developers**: Address and resolve feedback items.
3. **Stakeholders**: Monitor feedback trends and project progress.
4. **Viewers/Clients**: Access feedback and updates on resolution status.

### 3. Key Features

1. **Centralized Feedback Collection**
   * Display feedback submissions organized by project.
   * Support attachments such as screenshots and videos for richer context.
2. **Project-Based Organization**
   * Classify feedback using tags/labels.
   * Introduce **groupings** (e.g., “feature areas,” “modules,” or “milestones”) to subdivide large volumes of feedback.
   * Provide filtering and sorting options by tags, status, and grouping.
3. **Streamlined Issue Management**
   * Present feedback in a central dashboard with details like reporter name, date, and priority.
   * Allow status updates (e.g., "Open," "In Progress," "Resolved") and assignments to team members.
4. **Clear Communication and Collaboration**
   * Comment on feedback items to discuss solutions or updates.
   * Enable automatic notifications when statuses change or comments are added.
5. **Insights and Reporting**
   * Summarize feedback trends, including grouping-based analytics (e.g., which group has the most reported issues).
   * Provide visual charts/graphs to track progress, closure rates, and recurring themes.
6. **Security and Permissions**
   * Implement access control with roles (admin, developer, stakeholder, viewer).
   * Restrict data based on user roles to protect sensitive information.

### 4. Grouping Mechanism

To address the issue of clutter when there are 200+ feedback items in a single project, introduce a **grouping** entity or concept. Each project can have one or multiple groupings; for example, “Backend,” “Frontend,” “Mobile,” “Release 1.0,” “Epic A,” or “Feature XYZ.”

**Functionality:**

1. **Group Creation**
   * Project Managers (or Admins) create new groups within a project to categorize feedback items by a broader theme or milestone.
2. **Assigning Feedback Items to Groups**
   * When creating or editing a feedback item, the user can select the relevant group from a dropdown.
   * A feedback item can belong to exactly one group (for simplicity) or multiple groups if needed—depending on your design preference.
3. **Displaying Groups in the Dashboard**
   * The dashboard can be structured with collapsible sections or tabs, each corresponding to a grouping.
   * This ensures that large amounts of feedback are neatly partitioned and easier to navigate.
4. **Filtering by Group**
   * Users can filter feedback items by specific groups, in combination with other filters (e.g., status, priority).
   * This allows targeted viewing of items within a single domain or feature set.
5. **Analytics by Group**
   * Reports can show the number of open/closed items per group, top issues per group, and the average time to resolution by group.
   * This highlights areas that need more attention or resources.

### 5. User Flow Description

#### 5.1 Core User Actions

1. **View Feedback**
   * Navigate to the project dashboard.
   * Use filters to sort feedback by status, date, severity, **or grouping**.
   * Click on a feedback item to view details and attachments.
2. **Manage Feedback**
   * Select a feedback item.
   * Update the status (e.g., "Open," "In Progress").
   * Assign the item to a team member.
   * (Optionally) change the **group** if the item has been misclassified or if a new group is more relevant.
3. **Collaborate on Feedback**
   * Open a feedback item.
   * Add comments or reply to existing discussions.
   * Automatic notifications keep relevant team members updated.
4. **View Analytics**
   * Navigate to the analytics section.
   * Access reports and visualizations summarizing feedback data.
   * **Drill down by grouping** to see which categories or features have the most open issues.

#### 5.2 Grouping Workflow Example

1. **Create/Update a Group**
   * A Project Manager goes to "Project Settings" → "Groups."
   * Creates a new group (e.g., “API Endpoints”) or edits an existing one.
2. **Assign Feedback to a Group**
   * When a user submits feedback, they can choose “API Endpoints” from the dropdown.
   * On the dashboard, feedback items assigned to “API Endpoints” appear under that grouping.
3. **Filter by Group**
   * The developer filters the dashboard to only see items in the “API Endpoints” group, focusing on relevant tasks.

### 6. Data Input and Submission

* Feedback data is submitted externally or via a form.
* Data includes **title**, **description**, **attachments**, **tags**, **group**, **metadata** (date, reporter, etc.).

### 7. Data Retrieval and Display

* Feedback data is retrieved from the database and displayed in the dashboard.
* Key entities: **FeedbackItem**, **Project**, **User**, **Comment**, **Grouping**.

### 8. User Interaction and Navigation

* Users navigate through a main dashboard, project-specific pages, grouping-based sections, and analytics sections.
* A sidebar or top navigation bar provides access to different areas (Projects, Groups, Analytics, etc.).

### 9. Database Schema Considerations

#### 9.1 Identify Entities

1. **Project**
   * `id`, `name`, `description`
2. **FeedbackItem**
   * `id`, `title`, `description`, `attachments`, `tags`, `status`, `priority`, `date`, `reporter_id`, `project_id`, `group_id`
3. **Grouping** (New Entity)
   * `id`, `name`, `description`, `project_id`
   * (Optional: creation\_date, last\_update, etc.)
4. **User**
   * `id`, `name`, `email`, `role`
5. **Comment**
   * `id`, `content`, `date`, `user_id`, `feedback_item_id`

#### 9.2 Determine Relationships

* **Project** to **FeedbackItem**: One-to-many (a project can have multiple feedback items).
* **Project** to **Grouping**: One-to-many (a project can have multiple groupings).
* **Grouping** to **FeedbackItem**: One-to-many (a single group can contain multiple feedback items).
* **User** to **FeedbackItem**: Many-to-many (a user can submit multiple feedback items, and a feedback item can have multiple watchers or assignees, if you choose to store that relation).
* **FeedbackItem** to **Comment**: One-to-many (a feedback item can have multiple comments).

#### 9.3 Define Attributes

1. **FeedbackItem**
   * `id`: Unique identifier
   * `title`: Short summary of the issue/feedback
   * `description`: Detailed description
   * `attachments`: URL(s) or path(s) to screenshots, videos, etc.
   * `tags`: Array or comma-separated list of tags/labels
   * `status`: E.g., “Open,” “In Progress,” “Resolved”
   * `priority`: E.g., “Low,” “Medium,” “High”
   * `date`: Timestamp of feedback submission
   * `reporter_id`: Reference to `User.id`
   * `project_id`: Reference to `Project.id`
   * `group_id`: Reference to `Grouping.id` (nullable if no grouping is assigned)
2. **Grouping**
   * `id`: Unique identifier
   * `name`: E.g., “Backend,” “Frontend,” “Release 1.0,” “Mobile App,” “Epic A”
   * `description`: Optional text describing the grouping’s purpose
   * `project_id`: Reference to `Project.id`
3. **Project**
   * `id`: Unique identifier
   * `name`: Project name
   * `description`: Optional details about the project
4. **User**
   * `id`: Unique identifier
   * `name`: User’s full name
   * `email`: Email for login/notifications
   * `role`: E.g., “Admin,” “Developer,” “Viewer”
5. **Comment**
   * `id`: Unique identifier
   * `content`: Text of the comment
   * `date`: Timestamp for the comment
   * `user_id`: Reference to `User.id`
   * `feedback_item_id`: Reference to `FeedbackItem.id`

#### 9.4 Normalize the Schema

* Each entity has a unique `id`.
* Use foreign keys (`project_id`, `group_id`, `user_id`, etc.) to establish relationships.
* Keep the schema flexible for future enhancements (e.g., sub-grouping, multiple group assignments).

### 10. Summary

The **Feedback Tracker** now includes a **grouping** mechanism to handle large volumes of feedback without clutter. By allowing Project Managers to define groups (e.g., feature areas, milestones, or modules) and assigning items accordingly, the system provides more intuitive organization and easier navigation. This, combined with traditional tags, filtering, and analytics, makes for a powerful and scalable feedback solution that grows with your project needs.