import styled from 'styled-components';

export const SolidSectionStyled = styled.section`
  background: var(--bg-card, rgba(30, 41, 59, 0.7));
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

export const CardStyled = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const InputStyled = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  outline: none;
  &:focus {
    border-color: var(--accent, #3b82f6);
  }
`;

export const SelectStyled = styled.select`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  outline: none;
  &:focus {
    border-color: var(--accent, #3b82f6);
  }
`;
