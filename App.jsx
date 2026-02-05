import React, { useState, useEffect } from 'react';

// 게임 모드 설정
const GAME_MODES = [
  { id: 'all', name: '전체', icon: '🌟' },
  { id: 'gem', name: '젬 그랩', icon: '💎' },
  { id: 'ball', name: '브롤 볼', icon: '⚽' },
  { id: 'showdown', name: '쇼다운', icon: '💀' },
  { id: 'knockout', name: '녹아웃', icon: '🥊' },
  { id: 'rank', name: '경쟁전', icon: '🏆' }
];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newPost, setNewPost] = useState({
    nickname: '',
    trophy: '',
    mode: '젬 그랩',
    message: '',
    contact: ''
  });

  // 데이터 로드 (로컬 스토리지 사용)
  useEffect(() => {
    const savedPosts = localStorage.getItem('brawl_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    setLoading(false);
  }, []);

  // 데이터 저장 함수
  const saveToLocal = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('brawl_posts', JSON.stringify(newPosts));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.nickname || !newPost.message) return;

    const postData = {
      ...newPost,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      userId: 'admin' // 임시 유저 아이디
    };

    saveToLocal([postData, ...posts]);
    setIsModalOpen(false);
    setNewPost({ nickname: '', trophy: '', mode: '젬 그랩', message: '', contact: '' });
  };

  const deletePost = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = posts.filter(p => p.id !== id);
      saveToLocal(updated);
    }
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.mode === GAME_MODES.find(m => m.id === filter).name);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans">
      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-[#161b22]/90 backdrop-blur-md border-b-2 border-yellow-500/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black">B</div>
            <span className="font-black text-xl tracking-tighter italic">BRAWL MATE</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors"
          >
            모집글 쓰기
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 필터 바 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {GAME_MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setFilter(m.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                filter === m.id 
                ? 'bg-yellow-500 text-black border-yellow-500' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>

        {/* 게시글 리스트 */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-500">로딩 중...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800">
              <p className="text-slate-500 font-bold">등록된 모집글이 없습니다.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-[#1c2128] p-4 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl">
                      {GAME_MODES.find(m => m.name === post.mode)?.icon || '🔥'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-yellow-50">{post.nickname}</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold">
                          {post.trophy}🏆
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-snug">{post.message}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{post.mode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button 
                      onClick={() => alert(`연락처: ${post.contact || '작성된 연락처가 없습니다.'}`)}
                      className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                    >
                      참가하기
                    </button>
                    <button onClick={() => deletePost(post.id)} className="text-slate-600 hover:text-red-400 text-xs">삭제</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 모집 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1c2128] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-lg text-yellow-500 uppercase">팀원 모집하기</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input required value={newPost.nickname} onChange={e=>setNewPost({...newPost, nickname: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500" placeholder="닉네임" />
                <input required type="number" value={newPost.trophy} onChange={e=>setNewPost({...newPost, trophy: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500" placeholder="트로피" />
              </div>
              <select value={newPost.mode} onChange={e=>setNewPost({...newPost, mode: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none">
                {GAME_MODES.slice(1).map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
              <textarea required value={newPost.message} onChange={e=>setNewPost({...newPost, message: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500 h-20 resize-none" placeholder="모집 문구"></textarea>
              <input value={newPost.contact} onChange={e=>setNewPost({...newPost, contact: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-500" placeholder="연락처 (카톡/디코드)" />
              <button type="submit" className="w-full bg-yellow-500 text-black font-black py-3 rounded-lg hover:bg-yellow-400 transition-all uppercase text-sm">
                모집 게시
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
