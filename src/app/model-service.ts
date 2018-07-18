export class ModelService {
  private model: any;
  private settings: any;

  getModel(): any {
    return this.model;
  }

  setModel(model: any) {
    this.model = model;
  }

  getSettings(): any {
    return this.settings;
  }

  setSettings(settings: any) {
    this.settings = settings;
  }
}