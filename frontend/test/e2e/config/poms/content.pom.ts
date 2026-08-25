import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for a single ContentCard.
 *
 * Required data-testid attributes.
 */
export class ContentCardPOM {
  readonly root: Locator;

  constructor(
    private readonly page: Page,
    rootLocator: Locator,
  ) {
    this.root = rootLocator;
  }

  async clickEdit(): Promise<void> {
    await this.root.getByTestId('edit-button').click();
    await expect(this.root).toHaveAttribute('data-editing', 'true', {
      timeout: 5_000,
    });
  }

  /**
   * Tiptap renders div[contenteditable] — not a plain <input>.
   * We click in, Ctrl+A to select all existing content, then type the new value.
   */
  private async fillTiptap(testId: string, value: string): Promise<void> {
    const editable = this.root
      .getByTestId(testId)
      .locator('[contenteditable="true"]');
    await editable.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(value);
  }

  async fillTitle(value: string): Promise<void> {
    await this.fillTiptap('field-title', value);
  }

  async fillSubtitle(value: string): Promise<void> {
    await this.fillTiptap('field-subtitle', value);
  }

  async fillDescription(value: string): Promise<void> {
    await this.fillTiptap('field-description', value);
  }

  async clickSave(): Promise<void> {
    await this.root.getByTestId('save-button').click();
  }

  async clickCancel(): Promise<void> {
    await this.root.getByTestId('cancel-button').click();
    await expect(this.root).not.toHaveAttribute('data-editing', 'true', {
      timeout: 5_000,
    });
  }

  /** Two-step delete: "Delete" → "Confirm" */
  async clickDelete(): Promise<void> {
    await this.root.getByTestId('delete-button').click();
    await this.root.getByTestId('delete-confirm-button').click();
  }

  /**
   * Move card right using the MoveCardButtons arrow.
   * These are always visible (not hover-only) so they're more reliable than dnd-kit drag.
   * MoveCardButtons renders outside the Card but inside content-card root div.
   */
  async clickMoveRight(): Promise<void> {
    await this.root.getByTestId('move-card-right').click();
  }

  async clickMoveLeft(): Promise<void> {
    await this.root.getByTestId('move-card-left').click();
  }

  async uploadFile(filePath: string | string[]): Promise<void> {
    const paths = Array.isArray(filePath) ? filePath : [filePath];
    // input[type="file"] is hidden behind a label — setInputFiles works on hidden inputs
    await this.root.locator('input[type="file"]').setInputFiles(paths);
  }

  async removeMediaAt(index = 0): Promise<void> {
    await this.root
      .locator('[data-testid="media-item"]')
      .nth(index)
      .getByTestId('media-remove-button')
      .click();
  }

  async expectEditing(editing: boolean): Promise<void> {
    if (editing) {
      await expect(this.root).toHaveAttribute('data-editing', 'true');
    } else {
      await expect(this.root).not.toHaveAttribute('data-editing', 'true');
    }
  }

  async expectMediaCount(count: number): Promise<void> {
    await expect(this.root.locator('[data-testid="media-item"]')).toHaveCount(
      count,
      { timeout: 8_000 },
    );
  }
}

export class ContentManagerPOM {
  private readonly root: Locator;
  private readonly addBtn: Locator;

  constructor(
    private readonly page: Page,
    managerIndex = 0,
  ) {
    this.root = page
      .locator('[data-testid="content-manager"]')
      .nth(managerIndex);
    this.addBtn = this.root.getByTestId('add-card-button');
  }

  async clickAdd(): Promise<void> {
    const created = this.page.waitForResponse(
      (r) => r.url().includes('/api/graphql') && r.status() === 200,
    );
    await this.addBtn.click();
    await created;
  }

  async expectAddButtonDisabled(): Promise<void> {
    await expect(this.addBtn).toBeDisabled();
  }

  async waitForCardCount(count: number, timeout = 8_000): Promise<void> {
    await expect(this.root.locator('[data-testid="content-card"]')).toHaveCount(
      count,
      { timeout },
    );
  }

  card(index = 0): ContentCardPOM {
    return new ContentCardPOM(
      this.page,
      this.root.locator('[data-testid="content-card"]').nth(index),
    );
  }
}
