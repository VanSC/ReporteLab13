import { Component, ElementRef, ViewChild } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent {

  @ViewChild('table', { static: false }) table!: ElementRef<any>;

  openPdfTables() {
    const tableData = this.extractTableData();
    
    const documentDefinition: any = {
      content: [
         // Título centrado
         { text: 'Vehículos del día', style: 'title' },
         // Espacio para separar el título de la tabla
         { text: '\n', margin: [0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: tableData,
          },
        }
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10], // Margen inferior para separar el título de la tabla
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
          alignment: 'center',
        },
      }
    };
    
    pdfMake.createPdf(documentDefinition).open();
  }

  private extractTableData(): any[] {
    const rows = this.table.nativeElement.rows;
    const tableData = [];

    // Extraer encabezados de la tabla
    const headers = [];
    for (let j = 0; j < rows[0].cells.length; j++) {
      headers.push({ text: rows[0].cells[j].textContent, style: 'tableHeader' });
    }
    tableData.push(headers);

    // Extraer filas de la tabla
    for (let i = 1; i < rows.length; i++) {
      const row = [];
      for (let j = 0; j < rows[i].cells.length; j++) {
        row.push(rows[i].cells[j].textContent);
      }
      tableData.push(row);
    }

    return tableData;
  }
}
