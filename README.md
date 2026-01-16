# Architecture & Engineering Constraints

## Folder Structure and Separation of Concerns

### Backend

The backend follows the **Model-View-Controller (MVC)** pattern. In this project, the repository layer also plays the role of the data source (in-memory), which was a deliberate decision to keep the focus on **architecture, business rules, and UI behavior** under a time constraint.

Each layer’s responsibilities are clearly defined:

- **Repository layer**  
  Responsible for data access and persistence logic. It is split into an interface (`Repository`) and its concrete implementation (`RepositoryImpl`), which keeps the data access abstraction intact and makes future migration to a real database straightforward.

- **Service layer**  
  Contains the core business logic. It is responsible for validating input data, enforcing business rules, and throwing domain-specific exceptions when necessary.

- **Controller layer**  
  Acts only as an entry point, delegating requests to the service layer and returning responses.

- **Tests**  
  Isolated in their own directory, ensuring clear separation between production and test code.

This structure keeps the backend modular, testable, and aligned with real-world production standards, even while using an in-memory data source.

---

### Frontend

The frontend folder structure was designed to make **code navigation intuitive** and to clearly express **separation of responsibilities**.

Inside the `src` folder, the application is organized as follows:

- The codebase is componentized, and UI components live in their own directory, grouped into other folders by screen sections and responsibilities.
- API configuration is centralized in `api.ts`, located in the `config` folder, keeping all server-related configuration is defined in a single place.
- API calls are encapsulated in the `data/services` folder. The `data` layer currently contains only `services`, but it was designed to scale and could easily include additional subfolders if the application grew.
- The `domain` folder contains the **core types and concepts** the application revolves around, such as `Event`, `EventStatus`, filter types, and expected service responses.  
  This folder also contains **validators**, responsible for validating user input in forms.
- Custom hooks have their own dedicated folder:
  - `useHooks` contains hooks responsible for interacting with backend services.
  - `useFilteredEvents` handles client-side filtering, searching, and sorting logic applied by the user.
- The `utils` folder contains auxiliary functionality used across the application, such as:
  - modal and toast helpers
  - date formatting utilities
  - internationalization (`i18n`) configuration

This structure improves maintainability, readability, and scalability, while making the application easy to navigate through.

---

## Justification of Chosen Libraries and Technologies

### SweetAlert2

SweetAlert2 was chosen because it is simple, highly customizable, and accessibility-friendly.  
It provides built-in support for accessibility features such as aria-labels and keyboard navigation.

In this project, it is used to:

- display modals for creating and editing events
- confirm actions (such as deletions)
- show error alerts
- display toast notifications when actions succeed

Additionally, SweetAlert2 offers built-in input validation support, which integrates well with form workflows.

---

### i18n (react-i18next)

The internationalization library is well-established and easy to work with.  
This was my first time implementing internationalization, and i18n significantly simplified the process.
The use of translation files to define labels per language makes it straightforward to add support for additional languages in the future, without touching component logic, as well as centralizing text throughout the application.

---

### Vitest

Vitest was chosen as the testing framework for the frontend due to its fast execution and simplicity.

---

### Font Awesome

Font Awesome was used to provide clear and consistent icons throughout the interface, keeping a clean and intuitive interface.

## Scalability and Trade-offs

The current structure was designed to scale without major refactors by keeping responsibilities clearly separated (domain, entity-specific backend layers, UI components, and hooks).

### Scaling with More Features

If more features were added, the next steps would be:

- **Pagination and server-side filtering/sorting**  
  Since the current implementation uses an in-memory data store and the expected usage volume is small, implementing pagination was not necessary. This also made client-side filtering an acceptable choice.  
  However, if the application were to move to production, filtering, sorting, and pagination would need to be handled by the backend (e.g., `GET /events?query=&status=&sort=&page=&size=`), keeping the UI responsive for larger datasets and shifting these responsibilities to the server.  
  Java and Spring make this relatively straightforward through Spring Data pagination support.

- **Role-based permissions and authentication**  
  Introducing an authentication layer and user profiles would allow features such as inviting guests to events and defining role-based access.  
  For example, an event organizer could have access to management screens and detailed views that a guest would not. This could be implemented through protected routes/components on the frontend, token-based authentication, and role-based authorization rules on the backend.

- **Improved UX for mobile**  
  The application relies heavily on modals, which can negatively impact usability on smaller screens.  
  For a mobile-friendly experience, modals could be replaced or complemented by dedicated screens, collapsible containers, or drawer-style interactions, keeping action buttons safer from accidental clicks and forms more accessible.

### Scaling with More Entities/Possible Next Steps

If more entities were added (like Users, Roles, Tickets), the same architectural pattern would be applied consistently:

- Add entity types and validation rules in the `domain` folder.
- Add new service modules under `data/services` (e.g., `venues.service.ts`, `users.service.ts`).
- Create reusable UI components and entity-specific hooks following the same structure already used for events.
- Keep shared concerns (formatters, modal/toast helpers, internationalization) centralized in `utils` and `config`.
- Keep controllers, services, and repositories entity-specific, avoiding unnecessary coupling or overlaps.

This approach keeps the codebase consistent, maintainable, and developer-friendly as complexity grows.

## Data Validation Strategy (Frontend vs Backend Responsibilities)

Both the frontend and backend perform data validation throughout the application workflow, each with their own responsibilities.

The **frontend** is responsible for validating user input in order to keep the application user-friendly and provide immediate feedback during interactions. This includes validating required fields, date ranges, and basic business rules before submitting any request. By doing so, the frontend prevents unnecessary network calls and improves the overall user experience by guiding the user while filling out forms. 

The **backend**, however, does not rely on the frontend for correctness. It performs its own validations to protect the system and enforce business rules consistently. This ensures that invalid data cannot be persisted, even if requests are made bypassing the UI entirely. Any request that violates domain rules is rejected at the service layer through explicit validations and exceptions.

In summary, frontend validations are primarily focused on usability and interaction feedback, while backend validations are responsible for data integrity, security, and enforcing business rules, so that no invalid state can be stored regardless of the request origin.


### AI Usage
### Tests
### Performance considerations and state flow
