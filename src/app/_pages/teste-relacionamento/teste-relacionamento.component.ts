import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { segundaClasseParaTeste } from '../../_module/segundaClasseParaTeste';

@Component({
  selector: 'app-teste-relacionamento',
  templateUrl: './teste-relacionamento.component.html',
  styleUrls: ['./teste-relacionamento.component.css'],
})
export class TesteRelacionamentoComponent implements OnInit {
  formPrincipal!: FormGroup;
  listaProfissional = [
    { id: 1, nome: 'Profissional 1' },
    { id: 2, nome: 'Profissional 2' },
  ];
  listaPaciente = [
    { id: 1, nome: 'Paciente 1' },
    { id: 2, nome: 'Paciente 2' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarFormulario();
  }

  // Getter para acessar o FormArray
  get segundaClasseParaTeste(): FormArray {
    return this.formPrincipal.get('segundaClasseParaTeste') as FormArray;
  }

  // Adicionar novo item no FormArray
  adicionarItem(): void {
    const novoItem = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
    });
    this.segundaClasseParaTeste.push(novoItem);
  }

  // Remover item do FormArray
  removerItem(index: number): void {
    this.segundaClasseParaTeste.removeAt(index);
  }

  // Submeter formulário (apenas exemplo de uso)
  onSubmit(): void {
    console.log('Formulário completo:', this.formPrincipal.value);
    console.log('Itens do FormArray:', this.segundaClasseParaTeste.value);
    if (this.segundaClasseParaTeste.length === 0) {
      console.warn('Nenhum item adicionado à lista!');
    } else {
      // Lógica de envio
      console.log('Dados válidos prontos para envio:', this.formPrincipal.value);
    }
  }
  
  private criarFormulario(): void {
    this.formPrincipal = this.fb.group({
      id: [''],
      descricao: [''],
      pacienteId: [''],
      profissionalId: [''],
      segundaClasseParaTeste: this.fb.array<segundaClasseParaTeste>([]),
    });
  }

}
