import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../../services/project/project.service';
import { SharedService } from '../../../../services/sharedservice/shared-service.service';
import { Project } from '../../../../shared/models/project';

@Component({
  selector: 'app-qrscanner-html5',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatIconModule, RouterModule],
  templateUrl: './qrscanner-html5.component.html',
  styleUrl: './qrscanner-html5.component.scss'
})
export class QrscannerHtml5Component implements OnInit, OnDestroy {

  router: Router = inject(Router);
  projectService: ProjectService = inject(ProjectService);
  sharedService: SharedService = inject(SharedService);
  matSnackBar: MatSnackBar = inject(MatSnackBar);

  public statusMessage: string = 'QR-Code der Baustelle in den Rahmen halten';
  public hasError: boolean = false;
  public isLookingUp: boolean = false;

  private html5QrcodeScanner: Html5QrcodeScanner | null = null;

  // Set as soon as a matching project was found, so further scan callbacks
  // fired by the library while we're already navigating away are ignored.
  private isNavigatingAway: boolean = false;

  ngOnInit(): void {
    // The scan box scales with the actual camera preview instead of a fixed
    // 250x250 px region, so it fits properly on narrow smartphone screens as
    // well as on tablets.
    const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
      const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
      const size = Math.floor(minEdge * 0.7);
      return { width: size, height: size };
    };

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: qrboxFunction,
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    this.html5QrcodeScanner.render(
      (decodedText, decodedResult) => this.handleScanSuccess(decodedText, decodedResult),
      (error) => this.handleScanFailure(error)
    );
  }

  ngOnDestroy(): void {
    // Without this, the camera stream keeps running (and the browser's
    // camera indicator stays lit) after navigating away from this page.
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear().catch(() => {
        // Scanner may already be stopped/cleared - safe to ignore.
      });
    }
  }

  public handleScanSuccess(decodedText: string, decodedResult: any): void {

    if (this.isNavigatingAway || this.isLookingUp) {
      return;
    }

    const projectNo = decodedText?.trim();

    if (!projectNo) {
      return;
    }

    this.isLookingUp = true;
    this.hasError = false;
    this.statusMessage = `Baustelle ${projectNo} wird gesucht ...`;

    this.projectService.getByProjectNo(projectNo).subscribe({
      next: (project: Project) => {
        this.isLookingUp = false;

        if (project?.ProjectNo) {
          this.isNavigatingAway = true;

          // Saves the scanned project so the "Bilder hochladen" screen picks
          // it up (it subscribes to this same value) and photos taken on
          // site can immediately be attached to the right Baustelle.
          this.sharedService.setQrCodeValue(project);

          this.matSnackBar.open(`Baustelle ${project.ProjectNo} übernommen`, '', {
            duration: 3000,
            panelClass: ['snackbar-notification-success']
          });

          this.router.navigate(['/image-upload']);
        } else {
          this.hasError = true;
          this.statusMessage = `Keine Baustelle mit Nummer "${projectNo}" gefunden. Bitte erneut scannen.`;
          this.matSnackBar.open('Baustellennummer nicht gefunden', '', {
            duration: 4000,
            panelClass: ['snackbar-notification-error']
          });
        }
      },
      error: () => {
        this.isLookingUp = false;
        this.hasError = true;
        this.statusMessage = `Baustelle "${projectNo}" konnte nicht abgerufen werden. Bitte erneut scannen.`;
        this.matSnackBar.open('Baustelle konnte nicht abgerufen werden', '', {
          duration: 4000,
          panelClass: ['snackbar-notification-error']
        });
      }
    });
  }

  public handleScanFailure(error: any): void {
    // Fired continuously while no QR code is in frame - expected while the
    // user is aiming the camera, not an error worth surfacing.
  }
}
