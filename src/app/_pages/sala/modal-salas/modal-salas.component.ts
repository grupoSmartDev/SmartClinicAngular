import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import { Sala } from '../../../_module/salasModule';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-salas',
  templateUrl: './modal-salas.component.html',
  styleUrl: './modal-salas.component.css',
})
export class ModalSalasComponent {
  diasDaSemana = [
    { dia: 0, nome: 'Domingo' },
    { dia: 1, nome: 'Segunda' },
    { dia: 2, nome: 'Terça' },
    { dia: 3, nome: 'Quarta' },
    { dia: 4, nome: 'Quinta' },
    { dia: 5, nome: 'Sexta' },
    { dia: 6, nome: 'Sábado' },
  ];

  private diaMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  constructor(
    private salaService: SalasService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [0],
      nome: ['', Validators.required],
      local: [''],
      capacidade: [0, Validators.required],
      tipo: ['', Validators.required],
      horarioFincionamento: [''],
      status: [true, Validators.required],
      observacao: [''],
      horariosFuncionamento: this.fb.array([]),
    });

    this.carregarHorariosFuncionamento();
  }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() sala = {} as Sala;
  @Output() dataAtualizado = new EventEmitter<void>(); //pedir explicação jhow jhow
  formulario: FormGroup;
  isLoading = false;

  get horariosFuncionamentoArray(): FormArray {
    return this.formulario.get('horariosFuncionamento') as FormArray;
  }

  carregarHorariosFuncionamento(): void {
    this.diasDaSemana.forEach((dia, index) => {
      const grupo = this.fb.group(
        {
          diaSemana: [dia.dia],
          ativo: [false],
          horaInicio: [''],
          horaFim: [''],
        },
        { validators: this.validarHorario }
      );

      grupo.get('ativo')?.valueChanges.subscribe((ativo) => {
        if (ativo) {
          grupo.get('horaInicio')?.setValidators(Validators.required);
          grupo.get('horaFim')?.setValidators(Validators.required);
        } else {
          grupo.get('horaInicio')?.clearValidators();
          grupo.get('horaFim')?.clearValidators();
          grupo.get('horaInicio')?.setValue('');
          grupo.get('horaFim')?.setValue('');
        }
        grupo.get('horaInicio')?.updateValueAndValidity();
        grupo.get('horaFim')?.updateValueAndValidity();
      });

      this.horariosFuncionamentoArray.push(grupo);
    });
  }

  //somente validar caso esteja marcado o check de "atyivo"
  validarHorario(group: FormGroup): { [key: string]: boolean } | null {
    const inicio = group.get('horaInicio')?.value;
    const fim = group.get('horaFim')?.value;
    if (!inicio || !fim) return null;

    if (inicio >= fim) {
      return { invalidTimeRange: true };
    }
    return null;
  }

  validarPeloMenosUmDiaAtivo(
    formArray: FormArray
  ): { [key: string]: boolean } | null {
    const algumAtivo = formArray.controls.some(
      (ctrl) => ctrl.get('ativo')?.value
    );
    return algumAtivo ? null : { nenhumDiaAtivo: true };
  }

  copiarHorarioPrincipal(): void {
    const base = this.horariosFuncionamentoArray.at(1);
    const horaInicio = base.get('horaInicio')?.value;
    const horaFim = base.get('horaFim')?.value;
    const ativo = base.get('ativo')?.value;

    this.horariosFuncionamentoArray.controls.forEach((grupo, index) => {
      if (index !== 1) {
        grupo.get('horaInicio')?.setValue(horaInicio);
        grupo.get('horaFim')?.setValue(horaFim);
        grupo.get('ativo')?.setValue(ativo);
      }
    });
  }

  // carregarSala(sala: any) {
  //   this.formulario.patchValue(this.sala);
  // }

  carregarSala(sala: any): void {
    this.formulario.patchValue(sala);
    const array: FormArray = this.fb.array([]);
    this.diasDaSemana.forEach((dia) => {
      const horario = sala.horariosFuncionamento?.find(
        (h: any) => this.diaMap[h.diaSemana] === dia.dia
      );

      const horaInicio = horario?.horaInicio || '';
      const horaFim = horario?.horaFim || '';
      const ativo = !!horario;

      const grupo = this.fb.group(
        {
          diaSemana: [dia.dia],
          ativo: [ativo],
          horaInicio: [horaInicio, ativo ? Validators.required : []],
          horaFim: [horaFim, ativo ? Validators.required : []],
        },
        { validators: this.validarHorario }
      );

      array.push(grupo);
    });

    this.formulario.setControl('horariosFuncionamento', array);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sala']?.currentValue) {
      this.carregarSala(this.sala);
    }
  }

  fecharModal() {
    let btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.value;

    // ✅ Função para garantir formato TimeSpan correto
    const formatarHorario = (horario: string): string => {
      if (!horario) return '';

      // Se já tem segundos (formato HH:mm:ss), não adiciona nada
      if (horario.split(':').length === 3) {
        return horario;
      }

      // Se só tem hora e minuto (formato HH:mm), adiciona :00
      if (horario.split(':').length === 2) {
        return horario + ':00';
      }

      return horario;
    };

    // ✅ Criar objeto Sala completo para os horários
    const salaCompleta = {
      id: dados.id,
      nome: dados.nome,
      local: dados.local,
      capacidade: dados.capacidade,
      tipo: dados.tipo,
      horarioFincionamento: dados.horarioFincionamento,
      status: dados.status,
      observacao: dados.observacao
    };

    // ✅ Processar horários com objeto Sala completo
    const horariosFuncionamento = dados.horariosFuncionamento
      .filter((h: any) => h.ativo)
      .map((h: any) => ({
        diaSemana: h.diaSemana,
        horaInicio: formatarHorario(h.horaInicio),
        horaFim: formatarHorario(h.horaFim),
        Sala: salaCompleta  // ✅ Campo 'Sala' com objeto completo
      }));

    // ✅ Estrutura final
    const payload = {
      id: dados.id,
      nome: dados.nome,
      local: dados.local,
      capacidade: dados.capacidade,
      tipo: dados.tipo,
      horarioFincionamento: dados.horarioFincionamento,
      status: dados.status,
      observacao: dados.observacao,
      horariosFuncionamento: horariosFuncionamento
    };

    // 🔧 Para debugging
    console.log('Payload final:', payload);
    console.log('Horários com Sala:', horariosFuncionamento);

    this.isLoading = true;
    this.salaService.salvarSala(payload).subscribe({
      next: () => {
        this.fecharModal();
        this.dataAtualizado.emit();
      },
      error: (err) => console.error(err),
      complete: () => (this.isLoading = false),
    });
  }
}
