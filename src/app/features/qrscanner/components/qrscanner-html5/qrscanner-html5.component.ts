import { Component, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qrscanner-html5',
  imports: [],
  templateUrl: './qrscanner-html5.component.html',
  styleUrl: './qrscanner-html5.component.scss'
})
export class QrscannerHtml5Component implements OnInit{

  @Output() decodedText = new EventEmitter<string>();
  
  router: Router = inject(Router);

  ngOnInit(): void {
    const onScanSuccess = (decodedText: any, decodedResult: any) => {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      
      if(decodedResult!==''){
        this.decodedText.emit(decodedResult);
        this.router.navigate(['/image-upload']);
      }       
    };

    const onScanFailure = (error: any) => {
      console.warn(`Code scan error = ${error}`);
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      'reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  }
}
