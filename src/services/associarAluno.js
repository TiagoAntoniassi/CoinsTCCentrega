// associarAluno.js
import { getDatabase, ref, set, update } from "firebase/database";

export const associarAlunoATurma = async (alunoId, turmaId) => {
  const db = getDatabase();

  try {
    // Atualizando o nó do aluno com a turma associada
    const alunoRef = ref(db, `alunos/${alunoId}`);
    await update(alunoRef, { turma: turmaId });

    // Adicionando o aluno ao nó da turma
    const turmaAlunoRef = ref(db, `turmas/${turmaId}/alunos/${alunoId}`);
    await set(turmaAlunoRef, true);

    console.log("Aluno associado à turma com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao associar aluno à turma:", error);
    return false;
  }
};
