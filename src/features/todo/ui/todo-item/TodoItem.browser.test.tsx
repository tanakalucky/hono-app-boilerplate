import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { useTodoMutation } from "../../lib/use-todo-mutation";
import { TodoItem } from "./TodoItem";

vi.mock("../../lib/use-todo-mutation", () => ({
  useTodoMutation: vi.fn().mockReturnValue({ addTodo: vi.fn() }),
}));

const mockUseTodoMutation = vi.mocked(useTodoMutation);

describe("TodoItem", () => {
  describe("TODOの編集", () => {
    it("編集ボタン押下で、入力項目に切り替わること", async () => {
      // Arrange
      const mockEditTodo = vi.fn();

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: mockEditTodo as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const editButton = screen.getByRole("button", { name: /編集/i });

      // Act
      await userEvent.click(editButton);

      // Assert
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("編集ボタン押下後、キャンセルボタン押下で参照項目に切り替わること", async () => {
      // Arrange
      const mockEditTodo = vi.fn();

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: mockEditTodo as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const editButton = screen.getByRole("button", { name: /編集/i });
      await userEvent.click(editButton);

      const cancelButton = screen.getByRole("button", { name: /キャンセル/i });

      // Act
      await userEvent.click(cancelButton);

      // Assert
      const todoContent = screen.getByRole("paragraph");
      expect(todoContent).toHaveTextContent("アプリを作る");
    });

    it("編集ボタン押下後、保存ボタン押下で編集内容が保存されること", async () => {
      // Arrange
      const mockEditTodo = vi.fn();

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: mockEditTodo as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const editButton = screen.getByRole("button", { name: /編集/i });
      await userEvent.click(editButton);

      const input = screen.getByRole("textbox");
      await userEvent.fill(input, "りんごを買う");

      const saveButton = screen.getByRole("button", { name: /保存/i });

      // Act
      await userEvent.click(saveButton);

      // Assert
      expect(mockEditTodo).toHaveBeenCalledWith({
        todoId: "test-id",
        content: "りんごを買う",
      });
    });

    it("編集失敗時にエラーが表示され、編集されないこと", async () => {
      // Arrange
      const mockEditTodo = vi.fn().mockRejectedValue(new Error("編集失敗"));

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: mockEditTodo as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const editButton = screen.getByRole("button", { name: /編集/i });
      await userEvent.click(editButton);

      const input = screen.getByRole("textbox");
      await userEvent.fill(input, "りんごを買う");

      const saveButton = screen.getByRole("button", { name: /保存/i });

      // Act
      await userEvent.click(saveButton);

      // Assert
      expect(mockEditTodo).toHaveBeenCalledWith({
        todoId: "test-id",
        content: "りんごを買う",
      });

      const errorText = screen.getByRole("alert");
      expect(errorText).toHaveTextContent("保存に失敗しました");

      expect(screen.getByRole("paragraph")).not.toBeInTheDocument();
    });
  });

  describe("TODOの削除", () => {
    it("削除ボタン押下でTODOが削除されること", async () => {
      // Arrange
      const mockDeleteTodo = vi.fn();

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: mockDeleteTodo as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const deleteButton = screen.getByRole("button", { name: /削除/i });

      // Act
      await userEvent.click(deleteButton);

      // Assert
      expect(mockDeleteTodo).toHaveBeenCalledWith({
        todoId: "test-id",
      });
    });

    it("削除失敗時にエラーが表示され、削除されないこと", async () => {
      // Arrange
      const mockDeleteTodo = vi.fn(() => {
        throw new Error("削除に失敗しました");
      });

      mockUseTodoMutation.mockReturnValue({
        addTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
        deleteTodo: mockDeleteTodo as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
        editTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
      });

      const screen = await render(<TodoItem todo={{ id: "test-id", content: "アプリを作る" }} />);

      const deleteButton = screen.getByRole("button", { name: /削除/i });

      // Act
      await userEvent.click(deleteButton);

      // Assert
      const errorText = screen.getByRole("alert");

      expect(errorText).toHaveTextContent("削除に失敗しました");

      expect(mockDeleteTodo).toHaveBeenCalledWith({
        todoId: "test-id",
      });
    });
  });
});
