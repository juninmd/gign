```markdown
# AGENTS.md Guidelines

These guidelines are designed to ensure high-quality, maintainable, and efficient code development for the AGENTS repository. Adherence to these principles will promote DRY, KISS, SOLID, YAGNI, and minimize unnecessary complexity.

**1. DRY (Don't Repeat Yourself)**

- **Single Responsibility Principle:** Each agent module should have a single, well-defined purpose. Avoid creating overly complex modules with multiple responsibilities.
- **Code Reuse:** Design modules to be reusable across different projects or within the same project. Avoid duplicated logic.
- **Parameterization:** Minimize repetition of parameters and data structures. Parameterize functions and modules whenever possible.

**2. KISS (Keep It Simple, Stupid)**

- **Simplicity is Key:** Strive for the simplest solution that achieves the required functionality. Avoid unnecessary complexity.
- **Minimize Cognitive Load:** Code should be easy to understand and maintain. Avoid convoluted logic.
- **Clear Naming:** Use descriptive and unambiguous variable, function, and module names.

**3. SOLID Principles**

- **Single Responsibility:** (Reinforce) Each class/module should focus on a single, well-defined concern.
- **Open/Closed Principle:** The system should be extensible through additions or modifications without altering the existing code. Consider API design for flexible integration.
- **Liskov Substitution Principle:** Subclasses should be substitutable for their base classes without altering the correctness of the program.
- **Interface Segregation Principle:** Clients should not be forced to implement interfaces they do not use.
- **Dependency Inversion Principle:** High-level modules (classes) should not depend on low-level modules (classes). They should be able to be replaced by interfaces.

**4. YAGNI (You Aren't Gonna Need It)**

- **Avoid Unnecessary Code:** Don't write code that isn't currently required. Focus on implementing the necessary functionality.
- **Refactor Carefully:** Refactor code only when it is demonstrably causing problems or improving maintainability. Avoid premature refactoring.

**5. Development Process & Code Quality**

- **Code Reviews:** All code should undergo thorough code reviews by at least two developers. Prioritize early detection of bugs and compliance with coding standards.
- **Code Style:** Follow a consistent code style guide (defined in the `style.md` file). Use a linter (e.g., ESLint, pylint) to automatically enforce style guidelines.
- **Documentation:** Write clear and concise documentation for all modules and functions. Document assumptions, inputs, and outputs. Use docstrings.
- **Error Handling:** Implement robust error handling to prevent unexpected crashes and provide informative error messages.
- **Testing:** All code must be thoroughly tested to ensure functionality and prevent regressions. Use a comprehensive test suite covering unit, integration, and end-to-end tests.
- **Maintainability:** Code should be written in a way that makes it easy to understand, modify, and extend.

**6. File Structure & Size**

- **Maximum File Length:** 180 lines of code (excluding comments).
- **Modularization:** Organize code into well-defined modules, each with a single responsibility.
- **Consistent Directory Structure:** Follow a consistent directory structure for files and modules (e.g., `modules/agent_module_1.py`, `modules/agent_module_2.py`).

**7. Testing Requirements**

- **Minimum Test Coverage:** 80% (Achieve this target through comprehensive testing).
- **Test Data:** Use representative test data for each module and agent.
- **Test Case Design:** Ensure test cases cover edge cases, boundary conditions, and error scenarios.
- **Test Framework:** Utilize a testing framework (e.g., pytest, unittest) to automate testing.

**8. Specific Considerations (To be defined in additional files)**

- **Agent Types:** Define specific types of agents with their own modules and data structures.
- **Communication Protocols:** Specify communication protocols for agents to interact with each other.
- **Data Structures:** Define common data structures and their usage.
- **API Design:** Implement clear and consistent API design for agent interactions.
```
