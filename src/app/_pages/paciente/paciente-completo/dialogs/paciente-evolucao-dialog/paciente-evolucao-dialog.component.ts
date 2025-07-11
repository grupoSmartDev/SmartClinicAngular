import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { PacienteFormServiceService } from '../../../../../_services/pacienteCompleto/paciente-form-service.service';
import { EvolucaoService } from '../../../../../_services/evolucao.service';
import { ProfissionalService } from '../../../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { DatePtBrPipe } from '../../../../../_shared/pipes/date-pt-br.pipe';
import { Profissional } from '../../../../../_module/profissionalModule';
import { Paciente } from '../../../../../_module/pacienteModule';

@Component({
  selector: 'app-paciente-evolucao-dialog',
  templateUrl: './paciente-evolucao-dialog.component.html',
  styleUrl: './paciente-evolucao-dialog.component.css'
})
export class PacienteEvolucaoDialogComponent {
  @Input() paciente!: Paciente;
  @Output() evolutionSaved = new EventEmitter<void>();
  @Output() dialogClosed = new EventEmitter<void>();

  formEvolucao!: FormGroup;
  listaProfissional: Profissional[] = [];
  isLoading = false;
  isOpen = false;

  constructor(
    private patientFormService: PacienteFormServiceService,
    private evolucaoService: EvolucaoService,
    private profissionalService: ProfissionalService,
    private toastr: ToastrService,
    private datePipe: DatePtBrPipe
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfessionals();
  }

  // ========== INICIALIZAÇÃO ==========
  private initializeForm(): void {
    this.formEvolucao = this.patientFormService.createEvolutionForm();
  }

  private loadProfessionals(): void {
    this.profissionalService.Listar(
      undefined, undefined, undefined, undefined, undefined, undefined, false
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissional = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
      }
    });
  }

  // ========== GETTERS PARA TEMPLATE ==========
  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicios') as FormArray;
  }

  get atividades(): FormArray {
    return this.formEvolucao.get('atividades') as FormArray;
  }

  // ========== CONTROLE DO DIÁLOGO ==========
  openDialog(evolucao: any = null): void {
    const dialog = document.getElementById('evolution-dialog') as HTMLDialogElement;
    if (!dialog) return;

    this.isOpen = true;
    dialog.showModal();

    // Limpar formulário
    this.clearFormArrays();

    if (evolucao && evolucao.id) {
      this.populateForm(evolucao);
    } else {
      this.resetFormForNew();
    }
  }

  closeDialog(): void {
    const dialog = document.getElementById('evolution-dialog') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
      this.isOpen = false;
      this.dialogClosed.emit();
    }
  }

  // ========== POPULAÇÃO DO FORMULÁRIO ==========
  private clearFormArrays(): void {
    // Limpar exercícios
    while (this.exercicios.length) {
      this.exercicios.removeAt(0);
    }

    // Limpar atividades
    while (this.atividades.length) {
      this.atividades.removeAt(0);
    }
  }

  private populateForm(evolucao: any): void {
    // Preencher dados básicos
    this.formEvolucao.patchValue({
      id: evolucao.id || '',
      pacienteId: evolucao.pacienteId || this.paciente.id,
      profissionalId: evolucao.profissionalId || this.paciente.profissionalId,
      observacao: evolucao.observacao || '',
    });

    // Formatar e definir data
    if (evolucao.dataEvolucao) {
      const dataFormatada = this.datePipe.formatToHtmlDate(evolucao.dataEvolucao);
      this.formEvolucao.get('dataEvolucao')?.setValue(dataFormatada);
    }

    // Adicionar exercícios
    if (evolucao.exercicios?.length) {
      evolucao.exercicios.forEach((exercicio: any) => {
        this.adicionarExercicioComDados(exercicio);
      });
    }

    // Adicionar atividades
    if (evolucao.atividades?.length) {
      evolucao.atividades.forEach((atividade: any) => {
        this.adicionarAtividadeComDados(atividade);
      });
    }
  }

  private resetFormForNew(): void {
    this.formEvolucao.patchValue({
      id: '',
      pacienteId: this.paciente.id,
      profissionalId: this.paciente.profissionalId || '',
      observacao: '',
      dataEvolucao: new Date().toISOString().split('T')[0]
    });
  }

  // ========== GERENCIAMENTO DE EXERCÍCIOS ==========
  adicionarExercicio(): void {
    this.patientFormService.addExercise(this.formEvolucao);
  }

  removerExercicio(index: number): void {
    this.patientFormService.removeExercise(this.formEvolucao, index);
  }

  private adicionarExercicioComDados(exercicio: any): void {
    this.adicionarExercicio();
    const exercicioIndex = this.exercicios.length - 1;
    const exercicioGroup = this.exercicios.at(exercicioIndex) as FormGroup;

    exercicioGroup.patchValue({
      obs: exercicio.obs,
      descricao: exercicio.descricao,
      tempo: exercicio.tempo,
      repeticoes: exercicio.repeticoes,
      series: exercicio.series,
      evolucaoId: exercicio.evolucaoId
    });
  }

  // ========== GERENCIAMENTO DE ATIVIDADES ==========
  adicionarAtividade(): void {
    this.patientFormService.addActivity(this.formEvolucao);
  }

  removerAtividade(index: number): void {
    this.patientFormService.removeActivity(this.formEvolucao, index);
  }

  private adicionarAtividadeComDados(atividade: any): void {
    this.adicionarAtividade();
    const atividadeIndex = this.atividades.length - 1;
    const atividadeGroup = this.atividades.at(atividadeIndex) as FormGroup;

    atividadeGroup.patchValue({
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      tempo: atividade.tempo,
      evolucaoId: atividade.evolucaoId
    });
  }

  // ========== SALVAMENTO ==========
  salvarEvolucao(): void {
    // Garantir que o pacienteId está definido
    this.formEvolucao.patchValue({
      pacienteId: this.paciente.id,
    });

    if (this.formEvolucao.invalid) {
      this.toastr.error('Preencha todos os campos obrigatórios', 'Erro');
      this.patientFormService.showInvalidFields(this.formEvolucao);
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formEvolucao.value;
    dataToSave.pacienteId = this.paciente.id;

    const saveOperation = dataToSave.id
      ? this.evolucaoService.Atualizar(dataToSave)
      : this.evolucaoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizada' : 'criada';
        this.toastr.success(`Evolução ${action} com sucesso!`, 'Sucesso');
        this.isLoading = false;
        this.closeDialog();
        this.evolutionSaved.emit();
      },
      error: () => {
        console.error('Erro ao salvar evolução:');
        this.isLoading = false;
        this.toastr.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  // ========== VALIDAÇÕES ==========
  isFormValid(): boolean {
    return this.formEvolucao.valid;
  }

  hasExercises(): boolean {
    return this.exercicios.length > 0;
  }

  hasActivities(): boolean {
    return this.atividades.length > 0;
  }
}
