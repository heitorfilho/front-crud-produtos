import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./navegacao/menu/menu.component";
import { FooterComponent } from "./navegacao/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MenuComponent, FooterComponent]
})
export class AppComponent {
  title = 'front-end';
}
