import PsyanimAnimationClip from '../../src/utils/PsyanimAnimationClip.mjs';

describe('simple tests', () => {
    it('should find true to be true', () => {

        let clip = new PsyanimAnimationClip();

        expect(true).toBe(true);
    });
  
    it('should find false to be different from true', () => {
      expect(false).not.toBe(true);
    });
  });
  