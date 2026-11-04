# Linux 연구 환경 설정 노트

[문서 목록](./README.md) · [Notion 원문](https://pengsida.notion.site/59569d7b66954578b21bf1dc6ea35776)

이 문서는 원문에 기록된 Linux 서버 설정 경험을 한국어로 옮겼습니다. 오래된 버전·개인 설정이 포함되어 있으며, 현재의 설치 지침과 다른 부분은 번역자 주로 구분했습니다. 아래 명령은 설명용이며 번역 작업 중 실행하지 않았습니다.

## 셸 설정

원문은 zsh와 [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh)를 사용합니다.

| 도구 | 원문의 활용 방법 |
| --- | --- |
| [copyzshell](https://github.com/rutchkiwi/copyzshell) | 기존 컴퓨터의 설정을 새 컴퓨터로 복사. 원문은 zsh가 있는 새 환경에 Oh My Zsh를 별도 설치하기 전에 복사하라고 안내하며, 사용자 지정 포트는 해당 프로젝트 이슈 참고 |
| [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) | 구문 강조와 입력 오류 확인. 원문은 Oh My Zsh 방식으로 설치 |
| [자동 제안 설정 글](https://zhuanlan.zhihu.com/p/111707433) | 원하는 제안 수락에 Ctrl+F 사용. Tab 두 번으로 후보 선택 |
| fzf | 명령 이력을 검색하고 선택 |

자동 완성과 제안 수락 키는 사용하는 키 바인딩에 따라 달라질 수 있습니다.

```sh
cat /etc/shells       # 등록된 셸 목록
echo "$SHELL"        # 로그인 셸 설정 확인
chsh -s /usr/bin/zsh # 실제 설치 경로를 확인한 뒤 변경
```

원문에는 기본 셸을 바꿀 수 없을 때 ~/.bashrc 마지막에 zsh를 실행하는 방법도 있습니다. 이는 기본 셸 설정 변경과 다르며 셸을 중첩 실행할 수 있습니다. 번역자 주: 필요한 세션에서 직접 zsh를 실행하는 방법도 고려하세요.

### 자주 쓰는 도구

- ncdu: 디렉터리별 디스크 사용량 확인. 원문 설치 예시는 apt-get install ncdu입니다.
- nvtop / nvitop: GPU 사용 상태 확인. 원문은 nvtop 설치가 어려우면 Python 환경의 nvitop을 사용합니다.
- fzf: 목록과 명령 이력 검색.
- ctop: Docker 컨테이너 자원 사용량 확인. 원문 환경에서는 sudo가 필요했습니다.
- tmux: 터미널 세션 관리.
- Vim: 텍스트 편집.

## tmux 설정

~/.tmux.conf에 다음 설정을 넣습니다.

```tmux
set -g mouse on
set-option -g history-limit 5000
```

설정을 다시 읽거나 버전을 확인할 때:

```sh
tmux source-file ~/.tmux.conf
tmux -V
```

원문에는 오래된 mouse 관련 옵션인 mode-mouse, mouse-resize-pane, mouse-select-pane, mouse-select-window도 있습니다. 최신 설정에 섞어 넣지 말고 설치 버전의 설명을 확인하세요. 원문의 “setw- g”와 “souce-file”은 오타입니다. [tmux 공식 FAQ](https://github.com/tmux/tmux/wiki/FAQ)를 함께 참고하세요.

종합 설정 예시는 [samoshkin/tmux-config](https://github.com/samoshkin/tmux-config)입니다. 원문은 “2.4 초과 필요”라고 쓰면서 “2.1에서도 작동했다”는 경험을 덧붙입니다. 이는 현재 호환성 보장이 아닙니다. 구문 오류 사례는 [이슈 38](https://github.com/samoshkin/tmux-config/issues/38)에 연결되어 있습니다.

## Vim 설정

원문 설정 모음: [amix/vimrc](https://github.com/amix/vimrc).

다음은 ~/.vimrc에 넣는 Vim 설정 예시입니다.

```vim
" 행 번호 표시
set nu
" 원문에서 사용한 snipMate 설정
let g:snipMate = { 'snippet_version' : 1 }
```

파일 트리는 [NERDTree](https://github.com/preservim/nerdtree)를 사용합니다. 원문의 [자동 열기·닫기 참고 글](https://riptutorial.com/vim/example/30660/nerd-tree)과 함께, 트리를 연 뒤 편집 창으로 커서를 돌리는 설정을 제시합니다.

```vim
autocmd VimEnter * NERDTree | wincmd p
```

## Anaconda와 Miniconda

원문이 사용한 과거 설치 파일:

- [Anaconda3 2019.10 Linux x86_64](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-2019.10-Linux-x86_64.sh)
- [Miniconda3 Python 3.7 / 4.8.3 Linux x86_64](https://repo.anaconda.com/miniconda/Miniconda3-py37_4.8.3-Linux-x86_64.sh)
- [Miniconda 파일 목록](https://repo.anaconda.com/miniconda/)

번역자 주: 위 파일은 재현을 위한 과거 예시입니다. 신규 환경은 [공식 Linux 설치 안내](https://docs.conda.io/projects/conda/en/latest/user-guide/install/linux.html)에서 운영체제·CPU에 맞는 파일을 선택하세요. 원문의 zsh 실행 예시는 공식 안내에 맞춰 bash로 보정했습니다.

```sh
bash <다운로드한-설치파일.sh>
conda init zsh
source ~/.zshrc
```

conda를 찾지 못하면 실제 설치 경로와 초기화 상태를 확인합니다. 원문은 ~/.bashrc의 내용을 ~/.zshrc로 복사하는 방법을 소개하지만, 파일 전체를 무조건 복사하면 다른 셸 전용 구문도 옮겨집니다. 필요한 conda 초기화만 적용하는 편이 적절합니다.

### 환경 관리

원문의 Python 3.6은 당시 예시입니다. 실제 프로젝트에 필요한 버전으로 바꾸세요.

```sh
conda create --name your_env_name python=3.6
conda env create -f filepath.yaml
conda activate your_env_name
conda deactivate
```

다음 두 명령은 같은 의미이며, 지정한 환경의 패키지를 모두 삭제합니다.

```sh
conda remove -n your_env_name --all
conda remove --name your_env_name --all
```

원문의 [추가 명령 설명](https://blog.csdn.net/hejp_123/article/details/92151293).

### 원문에서 사용한 패키지 미러

원문은 중국 내 다운로드를 위해 Tsinghua의 free, main, conda-forge 채널과 [SenseTime 미러 안내](https://dx-mirrors.sensetime.com/help/use-conda-mirror.html)를 제시합니다. 한국 환경에서의 속도나 현재 제공 여부를 보장하는 목록은 아닙니다.

```sh
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --set show_channel_urls yes
```

특히 free는 과거 채널입니다. 기존 채널 설정을 확인한 뒤 프로젝트에 필요한 것만 선택하세요.

## pip 사용

현재 Python에 연결된 pip를 분명히 하도록 아래 예시는 python -m pip 형식으로 표기했습니다.

```sh
which python
which pip
python -m pip --version
python -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple tensorboard
python -m pip install jieba -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m pip install -U <패키지명>
```

원문은 pip 경로가 다른 환경을 가리키면 conda deactivate 후 해당 환경을 다시 activate하도록 안내합니다. 같은 환경에 설치했다고 해서 conda와 pip가 서로의 모든 의존성을 안전하게 조정해 주는 것은 아닙니다.

원문의 기본 인덱스 변경 예시:

```sh
python -m pip install --upgrade pip
python -m pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

원문에 등장하는 다른 주소도 출처 보존을 위해 남깁니다. HTTP와 trusted-host를 사용한 당시 pandas 설치 예시는 보안 검증을 약화시킬 수 있어 실행용 권장 명령으로 제시하지 않습니다.

| 원문 미러 | 당시 주소 |
| --- | --- |
| Aliyun | http://mirrors.aliyun.com/pypi/simple/ |
| Douban | http://pypi.douban.com/simple/ |
| Tsinghua | https://pypi.tuna.tsinghua.edu.cn/simple/ |
| USTC | http://pypi.mirrors.ustc.edu.cn/simple/ |

## CUDA 확인

원문은 ~/.zshrc에서 CUDA 설치 경로를 선택합니다. 아래 9.0은 과거 예시이며 실제 설치 버전과 경로로 바꿔야 합니다.

```sh
export CUDA_VER=9.0
export PATH="/usr/local/cuda-$CUDA_VER/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cuda-$CUDA_VER/lib64:$LD_LIBRARY_PATH"
source ~/.zshrc
```

버전과 GPU 사용 가능 여부 확인:

```sh
python -c "import torch; print(torch.__version__); print(torch.version.cuda)"
conda list cudatoolkit
nvcc --version
python -c "import torch; print(torch.cuda.is_available())"
```

번역자 주: torch.__version__은 PyTorch 버전, torch.version.cuda는 해당 PyTorch 빌드의 CUDA 버전입니다. nvcc는 경로에 잡힌 CUDA 툴킷의 컴파일러입니다. 원문의 “셋의 주 버전이 모두 같아야 한다”는 설명은 지나치게 단순합니다. PyTorch 설치 패키지, 드라이버, 로컬 툴킷의 관계를 [PyTorch 설치 안내](https://pytorch.org/get-started/locally/)와 [NVIDIA 호환성 문서](https://docs.nvidia.com/deploy/cuda-compatibility/index.html)에서 확인하세요.

원문의 version.txt 읽기 명령에는 “cacdt” 오타가 있으며 올바른 명령은 cat입니다. 해당 파일이 없는 배포본도 있으므로 파일 존재 여부를 확인해야 합니다.

## SSH 공개 키 로그인

로컬 공개 키의 내용을 서버의 ~/.ssh/authorized_keys에 추가합니다. 원문에서는 id_rsa.pub와 ssh-keygen -t rsa를 사용합니다. 공개 키 파일과 비밀 키를 혼동하지 마세요.

원문은 복사 오류를 줄이기 위해 공개 키를 temp.pub로 먼저 옮긴 다음 서버에서 다음과 같이 추가하는 방법을 제시합니다.

```sh
cat temp.pub >> ~/.ssh/authorized_keys
```

원문은 ~/.ssh의 권한으로 755를 제시합니다. 번역자 주: 개인 디렉터리와 authorized_keys의 접근 권한을 제한하는 다음 설정을 사용할 수 있습니다. 소유권과 서버 설정도 확인하세요. [OpenSSH 매뉴얼](https://man.openbsd.org/sshd.8)

```sh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

원문의 [로그인 문제 참고 글](https://serverfault.com/questions/525045/ssh-connection-asks-for-password-although-key-is-accepted).

